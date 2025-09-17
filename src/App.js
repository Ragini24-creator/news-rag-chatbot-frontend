import React, { useState, useEffect } from "react";
// import TypingIndicator from './UI/TypingIndicator'
import ChatWindow from './UI/ChatWindow'
import { createSession, getChatHistory, sendQuery } from './Utils/HelperMethods'
import "./App.css";


function App() {
  const [messages, setMessages] = useState([{ role: "bot", text: "Hello! How can I help you?" },]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function setup() {
      let existingSessionId = localStorage.getItem("sessionId");

      if (!existingSessionId) {
        const { newSessionId, history } = await createSession();
        setSessionId(sessionId);
        setMessages(history);
      } else {
        const response = await getChatHistory(existingSessionId);
        setMessages(response.history);
      }
    }

    setup();
  }, []);

  const addMessage = (text, type) => {
    setMessages([...messages, { text, type }]);
  };

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
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Something went wrong." },
      ]);
    } finally {
      // hide typing indicator
      setLoading(false);
    }
  };


  return (
    <div className="app-container">
      <ChatWindow messages={messages} isLoading={loading} />

      {/* Input area with Send button */}
      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message..."
          // value={inputText}
          // onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim() !== "") {
              handleSend(e.target.value);
              e.target.value = "";
            }
          }}
        />
        <button className="send-btn" onClick={handleSend}>
          Send
        </button>
      </div>

      {/* Clear Session Button */}
      <button className="clear-session-btn" onClick={() => { }}>
        Clear Session
      </button>
    </div>
  );
}

export default App;
