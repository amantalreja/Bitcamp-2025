import React, { useState, useEffect, useRef } from "react";
import Header from "../Header";
import "./LLMPage.css";
import { fetchRecentTransactions } from "../RecentTransactions";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCEU7MoDiVraj9t9GBt4GvOZBKoI9n3tZk" // your key
});

const LLMPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pastChats, setPastChats] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function loadTransactions() {
      const data = await fetchRecentTransactions();
      setTransactions(data.slice(0, 5));
    }
    loadTransactions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const fetchAIResponse = async (message) => {
    const context = "You are a dispute resolution assistant focused on transaction disputes.";
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `${context}\nUser: ${message}\nAssistant:`
      });
      return response.text;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Sorry, something went wrong.";
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { role: "user", content: userInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setLoading(true);

    const aiReply = await fetchAIResponse(userInput);
    const assistantMessage = { role: "assistant", content: aiReply };

    setChatMessages((prev) => [...prev, assistantMessage]);
    setLoading(false);
  };

  const startNewChat = () => {
    if (chatMessages.length > 0) {
      setPastChats(prev => [...prev, chatMessages]);
    }
    setChatMessages([]);
  };

  const formatAmount = (amount) => {
    if (isNaN(amount)) return "";
    const formatted = `$${Math.abs(amount).toFixed(2)}`;
    return amount < 0 ? (
      <span style={{ color: "red" }}>-{formatted}</span>
    ) : (
      <span style={{ color: "green" }}>{formatted}</span>
    );
  };

  const formatDate = (dateObj) => {
    if (!(dateObj instanceof Date)) return "";
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="llm-page">
      <Header />

      {/* Top - Transactions */}
      <section className="transactions-section">
        <div className="transactions-card">
          <h2>Recent Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, idx) => (
                <tr key={idx}>
                  <td>{formatDate(txn.TransactionDate)}</td>
                  <td>{txn.TransactionName}</td>
                  <td>{formatAmount(txn.TransactionAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom - Chat System */}
      <main className="llm-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Chats</h2>
            <button className="new-chat-btn" onClick={startNewChat}>+ New Chat</button>
          </div>
          <div className="chat-history">
            {pastChats.map((chat, idx) => (
              <div key={idx} className="chat-history-item">
                Conversation {idx + 1}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Chat */}
        <section className="content">
          <div className="chatbox">
            <div className="chat-header">
              💬 Dispute Assistant
            </div>

            <div className="chat-messages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.role}`}>
                  <div className="bubble">
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-bar">
              <button className="attachment-btn">📎</button>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                rows="2"
              />
              <button className="send-btn" onClick={handleSendMessage}>➤</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LLMPage;
