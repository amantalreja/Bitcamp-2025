import React, { useState, useEffect, useRef } from "react";
import Header from "../Header";
import "./LLMPage.css";
import { fetchRecentTransactions } from "../RecentTransactions";
import chatgptConfig from "../chatgpt-config"; // <-- USE NEW CONFIG
import disputeData from "./disputeData"; // <-- LOAD YOUR DISPUTE DATA

const LLMPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pastChats, setPastChats] = useState([]);
  const [animatedNumber, setAnimatedNumber] = useState(0);
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

  useEffect(() => {
    let start = 0;
    const end = 55;
    const duration = 1500;
    const frameRate = 30;
    const increment = end / (duration / (1000 / frameRate));

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setAnimatedNumber(Math.floor(start));
    }, 1000 / frameRate);

    return () => clearInterval(counter);
  }, []);

  const buildPrompt = (message) => {
    let prompt = "You are a financial dispute resolution expert. Here are real customer dispute cases you should consider:\n\n";

    disputeData.slice(0, 5).forEach((dispute, idx) => {
      prompt += `Case ${idx + 1}:\n`;
      prompt += `- Customer: ${dispute["Customer Name"]}\n`;
      prompt += `- Company: ${dispute["Company"]}\n`;
      prompt += `- Transaction Date: ${dispute["transaction_date"]}\n`;
      prompt += `- Amount: $${dispute["Amount"]}\n`;
      prompt += `- Dispute Reason: ${dispute["Dispute Reason"]}\n`;
      prompt += `- Dispute Status: ${dispute["Dispute Status"]}\n`;
      prompt += `- Summary: ${dispute["Consumer Complaint Narrative"]}\n\n`;
    });

    prompt += `\nNow based on the above, answer the user's question: "${message}"`;

    return prompt;
  };

  const fetchAIResponse = async (message) => {
    const fullPrompt = buildPrompt(message);
    try {
      const response = await fetch(chatgptConfig.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${chatgptConfig.apiKey}`,
        },
        body: JSON.stringify({
          model: chatgptConfig.model,
          messages: [
            { role: "system", content: "You are a professional financial dispute assistant." },
            { role: "user", content: fullPrompt }
          ],
          temperature: 0.2,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
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

  const handleDisputeClick = (transaction) => {
    const amount = Math.abs(transaction.TransactionAmount).toFixed(2);
    setUserInput(`I would like to dispute the transaction at ${transaction.TransactionName} on ${formatDate(transaction.TransactionDate)} for $${amount}.`);

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
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
                <th>Dispute</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, idx) => (
                <tr key={idx}>
                  <td>{formatDate(txn.TransactionDate)}</td>
                  <td>{txn.TransactionName}</td>
                  <td>{formatAmount(txn.TransactionAmount)}</td>
                  <td>
                    <button className="dispute-btn" onClick={() => handleDisputeClick(txn)}>
                      Dispute
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mini Stats Section */}
      <section className="dispute-stats-section">
        <div className="stats-card">
          <div className="stats-number">{animatedNumber}%</div>
          <div className="stats-text">of disputes resolved within 1 day!</div>
        </div>
      </section>

      {/* Bottom - Chat System */}
      <main className="llm-layout">
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

            {/* Suggested Prompts */}
            <div className="suggested-prompts">
              <h4>Suggested Dispute Reasons:</h4>
              <div className="prompt-list">
                <button onClick={() => setUserInput("Item not received.")}>Item not received</button>
                <button onClick={() => setUserInput("Charged incorrect amount.")}>Charged incorrect amount</button>
                <button onClick={() => setUserInput("Service not provided.")}>Service not provided</button>
                <button onClick={() => setUserInput("Fraudulent transaction detected.")}>Fraudulent transaction detected</button>
              </div>
            </div>

            {/* Input bar */}
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
