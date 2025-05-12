import { IoSendOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import api from "../services/api"; // Your Axios instance

const RoadMapAI = () => {
  const [text, setText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streamError, setStreamError] = useState(null);
  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    // Clean up the event source when the component unmounts
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);

  const sendPrompt = async () => {
    if (text.trim() === '') {
      setIsError(true);
      return;
    }
    setIsError(false);
    setAiResponse(''); // Clear previous response
    setLoading(true);
    setStreamError(null);

    // Close any existing event source
    if (eventSource) {
      eventSource.close();
    }

    try {
      // Send the prompt using your authenticated Axios instance
      await api.post('/api/gemini/roadmapai', { prompt: text });
      const token = localStorage.getItem('token'); 

      // Establish the EventSource connection *after* successfully sending the prompt
      const newEventSource = new EventSource('http://localhost:3000/api/gemini/roadmapai', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Adjust token if needed
        }
      });

      setEventSource(newEventSource);

      newEventSource.onopen = () => {
        console.log('SSE connection opened.');
      };

      newEventSource.onmessage = (event) => {
        const chunk = event.data;
        console.log('Received chunk:', chunk);
        setAiResponse((prevResponse) => prevResponse + chunk);
      };

      newEventSource.onerror = (error) => {
        console.error('SSE error:', error);
        setStreamError('Failed to receive AI response.');
        setLoading(false);
        if (newEventSource) {
          newEventSource.close();
        }
      };

      newEventSource.onclose = () => {
        console.log('SSE connection closed.');
        setLoading(false);
      };

      setText(''); // Clear input after sending
    } catch (error) {
      console.error("Error sending prompt:", error);
      setStreamError("Failed to send prompt to AI.");
      setLoading(false);
      if (eventSource) {
        eventSource.close();
      }
    }
  };

  return (
    <div>
      <div className="flex w-full max-w-xl p-4 rounded-2xl">
        <input
          className={`w-full px-4 py-2 shadow-md border rounded-xl focus:outline-none bg-gray-100 ${isError ? "border-red-500" : "border-none"}`}
          value={text}
          placeholder="Learn something..."
          onChange={(e) => setText(e.target.value)}
        />
        <div
          onClick={sendPrompt}
          className="w-14 h-12 rounded-full flex justify-center items-center bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
        >
          <IoSendOutline className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {loading && <p>Loading AI response...</p>}
      {streamError && <p className="text-red-500">Error: {streamError}</p>}
      {aiResponse && (
        <div className="mt-4 p-4 border rounded-md shadow-sm bg-gray-50">
          <h2>AI Response:</h2>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
};

export default RoadMapAI;
