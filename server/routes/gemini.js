// routes/gemini.js
const express = require("express");
const router = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const userSSEConnections = new Map();

// SSE GET endpoint
router.get("/roadmapai", (req, res) => {
  const userId = req.user.id;

   console.log(`📥 [${userId}] Connected to SSE`);

  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Keep the connection alive and send the data in real-time
  res.flushHeaders();

  userSSEConnections.set(userId,res);
  console.log("connection is set");

  // Clean up connections when the client closes
   req.on("close", () => {
    console.log(`❌ [${userId}] SSE connection closed`);
    userSSEConnections.delete(userId);
  });
  console.log("connection is closed");
});
router.post("/roadmapai", async (req, res) => {
  const userId = req.user.id;  // Make sure req.user is not undefined
  console.log(`📥 [${userId}]`);
  
  const { prompt } =req.body;
  console.log(`📥 [${userId}] Prompt received: ${prompt}`);
  const sysPrompt = `
                    You are a helpful assistant that returns structured, readable responses.
                    Please format your answer in Markdown, and use emoji in some headers 
                    and talk as much like a human as possible . 
                    dont give answers like this all the time , do so if necessary 
                    you can deviate from the structure and do your own thing if you want.
                    use emoji according to a 
                    particular color pallet.
                
                    Here's what I want:
                    - Add an optional title if it helps.
                    - Use bold text (**) for key points.
                    - Use bullet points or numbered lists when listing.
                    - Add headers using Markdown syntax (like ## or ###) when needed.
                    - Do not cut off sentences.

                    User prompt: ${prompt}`;

  
    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: sysPrompt }] }],
    });
    const clientRes = userSSEConnections.get(userId);
    if(!clientRes){
      console.warn(`⚠️ [${userId}] No SSE connection to send data`);
       return res.status(404).json({ error: "No client connection" });
    }

  try{

      for await(const chunk of result.stream){
        const textPart = chunk.text(); 
        clientRes.write(`data: ${JSON.stringify({ roadmap: textPart })}\n\n`);
      }
      clientRes.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      clientRes.end();
    
  } catch (error) {
     console.error("❌ Streaming error:", err);
    clientRes.write(`data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`);
    clientRes.end();
  }
});



module.exports = router;
