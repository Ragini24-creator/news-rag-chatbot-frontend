import React, { useState, useEffect } from "react";
import ChatWindow from './UI/ChatWindow'
import { createSession, getChatHistory, sendQuery, clearChatHistory } from './Utils/HelperMethods'
import "./App.css";


function App() {
  const [messages, setMessages] = useState([{ role: "bot", text: "Hello! How can I help you?" },]);
  const [sessionId, setSessionId] = useState(null);
  const [inputText, setInputText] = useState(null);
  const [loading, setLoading] = useState(false);


  // Handle Side Effects (usually for tasks to perform after website reloads)
  useEffect(() => {
    async function setup() {
      let existingSessionId = localStorage.getItem("sessionId");

      if (!existingSessionId) {
        const { newSessionId, history } = await createSession();
        setSessionId(sessionId);
        setMessages(history);
      } else {
        // set existing sessionId in state for global use
        setSessionId(existingSessionId);

        // get chat history associated with this sessionId
        const response = await getChatHistory(existingSessionId);
        setMessages(response.history);
      }
    }

    setup();
  }, []);

  // Handle Usr Query Processing Logic
  const handleSend = async (text) => {
    if (!text.trim()) return;

    // show user message immediately
    setMessages((prev) => [...prev, { role: "user", text }]);

    // set loading → show typing indicator
    setLoading(true);

    try {
      const chatbotAnswer = await sendQuery(sessionId, text);
      // add bot response
      setMessages((prev) => [...prev, { role: "bot", text: chatbotAnswer }]);

    } catch (error) {
      console.error("Error sending query:", error);
      setMessages((prev) => [...prev, { role: "bot", text: "⚠️ Something went wrong." },]);

    } finally {
      setLoading(false);
    }
  };

  // Handle Session Reset Logic
  const handleReset = async function () {
    const wasSessionReset = await clearChatHistory(sessionId);

    if (wasSessionReset) {
      setMessages([]);
      alert('Your session has been reset!')
    }
    else {
      alert('Failed to reset session!')
    }
  }


  return (
    <div className="app-container">
      <ChatWindow messages={messages} isLoading={loading} />


      {/* Input area with Send button */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputText.trim() !== "") {
              handleSend(inputText.trim());
              setInputText("");
            }
          }}
        />

        {/* Send Button */}
        <button
          className="send-btn"
          onClick={() => {
            if (inputText.trim() !== "") {
              handleSend(inputText.trim());
              setInputText("");
            }
          }}
        >
          Send
        </button>
      </div>


      {/* Reset Session Button */}
      <button className="clear-session-btn" onClick={handleReset}>
        Reset Session
      </button>
    </div>
  );
}

export default App;
