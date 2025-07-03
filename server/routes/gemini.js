const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ChatModel } = require("../db");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash",

   generationConfig: {
    temperature: 0.7, 

  },
 });

const userSSEConnections = new Map();

//in sse ,get endpoint should be written first to establish the connection first so that the post end point can stream data to the frontend
router.get("/roadmapai", async(req, res) => {
  const userId = req.user.id;
  

  
   console.log(`📥 [${userId}] Connected to SSE`);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();//realtime data sending (it keeps the connection alive)

  userSSEConnections.set(userId,res);
  console.log("connection is set");

   req.on("close", () => {
    console.log(`❌ [${userId}] SSE connection closed`);
    userSSEConnections.delete(userId);
    console.log("connection is closed");
  });
  
});
router.post("/roadmapai", async (req, res) => {
  const userId = req.user.id;  
  console.log(`📥 [${userId}]`);
  
  const { prompt,chatId } =req.body;

   const finalChatId = chatId || new mongoose.Types.ObjectId().toString();

   const previousMessages = await ChatModel.find({ userId, chatId: finalChatId })
    .sort({ timestamp: 1 })
    .limit(10);
    const context = previousMessages.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: msg.parts.map((p) => ({ text: p.text })),
     }));


  console.log(`📥 [${userId}] Prompt received: ${prompt}`);

  context.push({

    role : "user",
    parts : [{
        text : `
                  SYSTEM PROMPT (MAKE SURE TO GIVE RESPONSE ACCORDING TO THIS):  You are a helpful assistant that helps in achiving goals and give roadmaps anything other than that do not answer and give short and concise answer .
                    
                    User prompt: ${prompt}`
    }]
  })
  
    const result = await model.generateContentStream({
      contents: context,
    });
    const clientRes = userSSEConnections.get(userId);
    if(!clientRes){
      console.warn(`⚠️ [${userId}] No SSE connection to send data`);
       return res.status(404).json({ error: "No client connection" });
    }

  try{

    let fullresponse = ''

      for await(const chunk of result.stream){
        const textPart = chunk.text(); 
        fullresponse += textPart;
        clientRes.write(`data: ${JSON.stringify({ roadmap: fullresponse })}\n\n`);
      }

      clientRes.write(`data: ${JSON.stringify({ done: true, chatId : finalChatId })}\n\n`);
      clientRes.end();
    
  } catch (error) {
     console.error("❌ Streaming error:", error);
    clientRes.write(`data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`);
    clientRes.end();
  }
});

// Get chat history for a chatId
router.get("/roadmapai/history", async (req, res) => {
  const userId = req.user.id;
  const { chatId } = req.query;
  if (!chatId) return res.status(400).json({ error: "chatId required" });

  try {
    const messages = await ChatModel.find({ userId, chatId }).sort({ timestamp: 1 });
    // Format for frontend
    const formatted = messages.map(msg => ({
      role: msg.role,
      text: msg.parts.map(p => p.text).join("")
    }));
    res.json({ messages: formatted });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// Save message to chat history
router.post("/roadmapai/save", async (req, res) => {
  const userId = req.user.id;
  const { chatId, message } = req.body;
  if (!chatId || !message || !message.role || !message.text)
    return res.status(400).json({ error: "chatId and message (role, text) required" });

  try {
    await ChatModel.create({
      userId,
      chatId,
      role: message.role,
      parts: [{ text: message.text }],
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// Delete all messages for a chatId
router.delete("/roadmapai/history", async (req, res) => {
  const userId = req.user.id;
  const { chatId } = req.query;
  if (!chatId) return res.status(400).json({ error: "chatId required" });

  try {
    await ChatModel.deleteMany({ userId, chatId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete chat history" });
  }
});

module.exports = router;
