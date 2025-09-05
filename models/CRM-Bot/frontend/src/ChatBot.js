import React, { useState } from "react";
import axios from "axios";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const response = await axios.post("http://127.0.0.1:8000/bot/respond", {
        message: input,
      });

      const botReply = response.data.reply;

      setMessages([...newMessages, { sender: "bot", text: botReply }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Error connecting to server." },
      ]);
    }

    setInput("");
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#0078d4" : "#e5e5ea",
              color: msg.sender === "user" ? "white" : "black",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    width: "400px",
    height: "500px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    margin: "20px auto",
    fontFamily: "Arial, sans-serif",
  },
  messages: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    gap: "5px",
  },
  message: {
    padding: "8px 12px",
    borderRadius: "15px",
    maxWidth: "70%",
  },
  inputContainer: {
    display: "flex",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none",
  },
  button: {
    padding: "10px 15px",
    border: "none",
    backgroundColor: "#0078d4",
    color: "white",
    cursor: "pointer",
  },
};

export default ChatBot;
