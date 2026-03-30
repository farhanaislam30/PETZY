import React, { useState } from "react";
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello 👋 I'm Petzy AI Assistant.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send the user input to backend AI API
      const response = await axios.post(
        'http://localhost:3000/aicall', // full backend path
        { contents: input }, // pass user input as 'contents'
        { headers: { 'Content-Type': 'application/json' } }
      );

      // AI response from backend
      const botReply =response.data || "Sorry, I didn't understand that 🐾";
      console.log("AI response:", botReply);
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
      setInput(""); // clear input field
    } catch (error) {
        console.log(error);
      console.error("Chat API error:", error.response?.data || error.message);

      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          "Something went wrong with AI 🐾";
      
      setMessages((prev) => [
        ...prev,
        { text: `Error: ${errorMessage}`, sender: "bot" },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "linear-gradient(135deg,#f6d365,#fda085)",
          color: "white",
          padding: "15px",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: "bold",
          zIndex: 999,
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontSize: "26px" }}>🐾</div>
        <div style={{ fontSize: "14px" }}>Chat</div>
      </div>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "340px",
            height: "450px",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg,#f6d365,#fda085)",
              color: "white",
              padding: "12px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            🤖 Petzy AI Assistant
          </div>

          <div
            style={{
              flex: 1,
              padding: "15px",
              overflowY: "auto",
              fontSize: "14px",
              background: "#f9f9f9",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "12px",
                }}
              >
                {msg.sender === "bot" && (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
                    alt="pet-logo"
                    style={{ width: "30px", height: "30px", marginRight: "8px" }}
                  />
                )}
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "10px 14px",
                    borderRadius: "18px",
                    background: msg.sender === "user" ? "#fda085" : "white",
                    color: msg.sender === "user" ? "white" : "black",
                    boxShadow:
                      msg.sender === "bot" ? "0 2px 5px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", padding: "10px", background: "white" }}>
            <input
              type="text"
              className="form-control"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something about pets..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="btn btn-warning ms-2" onClick={handleSend}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;