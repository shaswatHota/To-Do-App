// routes/gemini.js
const express = require("express");
const router = express.Router();
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let eventSourceConnections = [];

router.post("/roadmapai", async (req, res) => {
  const { prompt } = req.body;
  console.log("📥 Received prompt:", prompt);

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.text();
    console.log("✅ Gemini response:", text);

    // Simulating SSE: Emit result to clients listening to SSE
    eventSourceConnections.forEach((client) => {
      client.write(`data: ${JSON.stringify({ roadmap: text })}\n\n`);
    });

    res.json({ roadmap: text }); // You can return an immediate response if necessary
  } catch (error) {
    console.error("❌ Gemini Error:", error);
    res.status(500).json({ error: "Something went wrong with Gemini" });
  }
});

// SSE GET endpoint
router.get("/roadmapai", (req, res) => {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Keep the connection alive and send the data in real-time
  res.flushHeaders();

  eventSourceConnections.push(res);

  // Clean up connections when the client closes
  req.on("close", () => {
    eventSourceConnections = eventSourceConnections.filter((client) => client !== res);
  });
});

module.exports = router;
