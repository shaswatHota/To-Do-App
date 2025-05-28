import { IoSendOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import api from "../services/api"; // Your Axios instance
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const RoadMapAI = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]); 
  const [chatId, setChatId] = useState(() => localStorage.getItem("chatId") || generateChatId());
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamError, setStreamError] = useState(null);
  const [eventSource, setEventSource] = useState(null);

  function generateChatId() {
    const id = crypto.randomUUID();
    localStorage.setItem("chatId", id);
    return id;
  }

  // Fetch previous messages on mount or when chatId changes
  useEffect(() => {
    let ignore = false;
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/api/gemini/roadmapai/history?chatId=${chatId}&token=${token}`);
        if (!ignore) setMessages(res.data.messages || []);
      } catch (err) {
        if (!ignore) console.error("Failed to fetch chat history:", err);
      }
    };
    fetchMessages();
    return () => { ignore = true; };
  }, [chatId]);

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const sendPrompt = async () => {
    if (text.trim() === "") {
      setIsError(true);
      return;
    }

    setIsError(false);
    setLoading(true);
    setStreamError(null);

    const token = localStorage.getItem("token");
    const userMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setText("");

    // Save user message to backend
    try {
      await api.post("/api/gemini/roadmapai/save", { chatId, message: userMessage });
    } catch (err) {
      console.error("Failed to save user message:", err);
    }

    if (eventSource) {
      eventSource.close();
    }

    try {
      const newEventSource = new EventSource(
        `http://localhost:3000/api/gemini/roadmapai?token=${token}&chatId=${chatId}` //future note:- sending tokens in quary param may compromize security
      );

      setEventSource(newEventSource);

      let modelReply = "";

      newEventSource.onopen = () => {
        console.log("SSE connection opened.");
      };

      newEventSource.onmessage = async (event) => {
        try {
          const chunk = JSON.parse(event.data);

          if (chunk.done) {
            setLoading(false);
            setMessages((prev) => [...prev, { role: "model", text: modelReply }]);
            // Save model message to backend
            try {
              await api.post("/api/gemini/roadmapai/save", { chatId, message: { role: "model", text: modelReply } });
            } catch (err) {
              console.error("Failed to save model message:", err);
            }
            newEventSource.close();
            setEventSource(null);
          } else if (chunk.roadmap) {
            modelReply += chunk.roadmap;
          }
        } catch (err) {
          console.error("⚠️ Failed to parse SSE message:", event.data);
        }
      };

      newEventSource.onerror = (error) => {
        console.error("SSE error:", error);
        setLoading(false);
        if (!modelReply) {
          setStreamError("Failed to receive AI response.");
        }
        newEventSource.close();
      };

      await api.post("/api/gemini/roadmapai", { prompt: text, chatId });
    } catch (error) {
      console.error("Error sending prompt:", error);
      setStreamError("Failed to send prompt to AI.");
      setLoading(false);
    }
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      sendPrompt();
    }
  };

  const startNewChat = async () => {
    const oldChatId = chatId;
    const newId = generateChatId();
    setChatId(newId);
    setMessages([]);
    setText("");
    localStorage.setItem("chatId", newId);
    if (eventSource) eventSource.close();
    try {
      await api.delete(`/api/gemini/roadmapai/history?chatId=${oldChatId}`);
    } catch (err) {
      console.error("Failed to clear chat history:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-600">Roadmap AI Chat</h1>
        <div
          className="px-3 py-1 text-sm bg-gradient-to-r from-[#FD6A5E] to-[#FF8A7A] text-white rounded-lg hover:bg-[#b84f4f] hover:cursor-pointer"
          onClick={startNewChat}
        >
          New Chat
        </div>
      </div>

      <div className="space-y-4 mb-4">

        {messages.length === 0 && (
        <div className="flex-grow flex justify-center items-center">
          <h2 className="text-2xl text-gray-400 pt-24">What do you want to learn today?</h2>
        </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-md shadow-sm ${msg.role === "user" ? "bg-white text-right" : "bg-gray-200 text-left"}`}
          >
            <ReactMarkdown  remarkPlugins={[remarkGfm]}>
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}
      </div>

        {loading && <p className="text-center text-sm text-gray-500">Loading AI response...</p>}
      {streamError && <p className="text-red-500">Error: {streamError}</p>}
      
      <div className="w-screen h-10 fixed bottom-0  bg-white">  </div>
      <div className={`flex translate-x-0 md:-translate-x-14 transition-all duration-700 ease-in-out transform
                        p-4 rounded-2xl bg-gray-100
                        w-full max-w-[90%] sm:max-w-xl md:max-w-2xl ${messages.length > 0
                      ? "fixed bottom-5 translate-y-0 "
                      : "absolute"}`}>
                        
        <input
          className={`w-full px-4 py-2 shadow-md border rounded-xl focus:outline-none bg-white ${isError ? "border-red-500" : "border-none"} `}
          value={text}
          placeholder="Ask something..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleEnterKey}
        />
        <div
          onClick={sendPrompt}
          className="w-14 h-12 rounded-full flex justify-center items-center bg-white  hover:bg-gray-200 transition cursor-pointer"
        >
          <IoSendOutline className="w-5 h-5 text-[#ff6b6b]" />
        </div>
      </div>
      

      
    </div>
  );
};

export default RoadMapAI;
