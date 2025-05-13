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

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.text();
    console.log("✅ Gemini response:", text);

    const clientRes = userSSEConnections.get(userId);
    // Simulating SSE: Emit result to clients listening to SSE
    if(clientRes) {
      clientRes.write(`data: ${JSON.stringify({ roadmap: text })}\n\n`);
    }else {
      console.warn(`⚠️ [${userId}] No SSE connection to send data`);
    }
    clientRes.end();

    res.json({success : true }); // You can return an immediate response if necessary
  } catch (error) {
    console.error("❌ Gemini Error:", error);
    res.status(500).json({ error: "Something went wrong with Gemini" });
  }
});



module.exports = router;
