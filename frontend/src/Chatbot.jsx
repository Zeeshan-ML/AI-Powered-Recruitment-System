import React, { useState, useEffect, useRef } from "react";
import api from "./axiosInstance";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false); // Controls the open/closed state of the chat window
  const [input, setInput] = useState(""); // Holds the current user input
  const [chatHistory, setChatHistory] = useState([]); // Stores conversation history
  const [loading, setLoading] = useState(false); // Loading state when waiting for a response
  const messagesEndRef = useRef(null);

  // Toggle the chat window visibility
  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  // useEffect to add a welcome message when chat is opened for the first time
  useEffect(() => {
    if (isOpen && chatHistory.length === 0) {
      const welcomeMessage = {
        sender: "bot",
        text: "Hello, Sir. How can I assist you!",
      };
      setChatHistory([welcomeMessage]);
    }
  }, [isOpen, chatHistory.length]);

  // Send the message to the FastAPI endpoint and update chat history
  const handleSend = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add the user's message to chat history
    const userMessage = { sender: "user", text: trimmedInput };
    setChatHistory((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("chatbot/get_answer", {
        query: trimmedInput,
      });
      const botMessage = { sender: "bot", text: response.data.answer };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        sender: "bot",
        text: "Sorry, something went wrong. Please try again.",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to the latest message whenever chatHistory or the window state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isOpen]);

  return (
    <>
      {isOpen && (
        <div style={chatWindowStyle}>
          <div style={headerStyle}>
            <span>Chat Support</span>
            <button onClick={toggleChat} style={closeButtonStyle}>
              &times;
            </button>
          </div>
          <div style={messagesContainerStyle}>
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                style={msg.sender === "user" ? userMsgStyle : botMsgStyle}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div style={botMsgStyle}>Loading...</div>}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} style={formStyle}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={inputStyle}
            />
            <button type="submit" style={sendButtonStyle} disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}
      {/* Chat icon at the bottom left */}
      <div style={chatIconStyle} onClick={toggleChat}>
        <span style={{ fontSize: "24px", color: "#fff" }}>💬</span>
      </div>
    </>
  );
};

// Inline styling adjustments

const chatIconStyle = {
  position: "fixed",
  bottom: "20px",
  left: "20px", // Positioned at bottom left as requested
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  backgroundColor: "#007bff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  zIndex: 1000,
};

const chatWindowStyle = {
  position: "fixed",
  bottom: "80px",
  left: "20px",
  width: "350px", // Increased width for a more spacious view
  height: "500px", // Fixed height ensures the window is large even when empty
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
};

const headerStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "10px",
  borderTopLeftRadius: "8px",
  borderTopRightRadius: "8px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const closeButtonStyle = {
  background: "none",
  border: "none",
  color: "#fff",
  fontSize: "20px",
  cursor: "pointer",
};

const messagesContainerStyle = {
  flex: 1,
  padding: "10px",
  overflowY: "auto",
  backgroundColor: "#f9f9f9",
};

const formStyle = {
  display: "flex",
  borderTop: "1px solid #ccc",
};

const inputStyle = {
  flex: 1,
  border: "none",
  padding: "10px",
  outline: "none",
};

const sendButtonStyle = {
  border: "none",
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "10px 15px",
  cursor: "pointer",
};

const userMsgStyle = {
  alignSelf: "flex-end",
  backgroundColor: "#dcf8c6",
  padding: "8px",
  borderRadius: "8px",
  marginBottom: "8px",
  maxWidth: "80%",
};

const botMsgStyle = {
  alignSelf: "flex-start",
  backgroundColor: "#ececec",
  padding: "8px",
  borderRadius: "8px",
  marginBottom: "8px",
  maxWidth: "80%",
};

export default Chatbot;
