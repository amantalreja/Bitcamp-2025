import React, { useEffect } from "react";
import "./CreditCard.css";

const CreditCard = ({ transactions = [] }) => {
  useEffect(() => {
    function updateCardDetails() {
      let maskedNumber = "1111 xxxx xxxx 1452";
      let fullNumber = "1111 ";
      for (let i = 0; i < 2; i++) {
        let part = Math.floor(Math.random() * 9000 + 1000);
        fullNumber += part + " ";
      }
      fullNumber += "1452";

      const frontNumberEl = document.querySelector("#front #hidden-number");
      const backNumberEl = document.querySelector("#back #hidden-number");
      if (frontNumberEl) frontNumberEl.textContent = maskedNumber;
      if (backNumberEl) backNumberEl.textContent = fullNumber;

      let cvv = Math.floor(Math.random() * 900 + 100);
      const cvvEl = document.getElementById("cvv");
      if (cvvEl) cvvEl.textContent = "CW: " + cvv;

      let month = ("0" + (Math.floor(Math.random() * 12) + 1)).slice(-2);
      let year = Math.floor(Math.random() * 10 + 23);
      const validDateEl = document.getElementById("valid-date");
      if (validDateEl) validDateEl.textContent = "Expiry: " + month + "/" + year;

      const nameEls = document.querySelectorAll(".name");
      nameEls.forEach(el => {
        el.textContent = "John Doe";
      });

      const titleTextEls = document.querySelectorAll(".title-text");
      titleTextEls.forEach(el => {
        el.innerHTML = `
          <img src="https://companieslogo.com/img/orig/COF_BIG.D-bf4ccef2.svg?t=1720244491&download=true"
          alt="Capital One Logo" style="height:50px;">
        `;
      });

      const typeEls = document.querySelectorAll(".type");
      typeEls.forEach(el => {
        el.innerHTML = "<i>Venture Studio</i>";
      });
    }

    function flip() {
      const cardEl = document.getElementById("card");
      if (cardEl) {
        cardEl.classList.toggle("flipped");
      }
      const frontReflection = document.querySelector("#front .reflection");
      const backReflection = document.querySelector("#back .reflection");
      if (frontReflection) frontReflection.classList.toggle("move");
      if (backReflection) backReflection.classList.toggle("move");

      updateCardDetails();
    }

    const showBtn = document.getElementById("show-btn");
    const hideBtn = document.getElementById("hide-btn");

    if (showBtn) showBtn.addEventListener("click", flip);
    if (hideBtn) hideBtn.addEventListener("click", flip);

    return () => {
      if (showBtn) showBtn.removeEventListener("click", flip);
      if (hideBtn) hideBtn.removeEventListener("click", flip);
    };
  }, []);

  // Helper: format date to "Apr 11, 2025"
  function formatDate(dateObj) {
    if (!(dateObj instanceof Date)) return "";
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  }

  // Helper: format amount with color
  function formatAmount(amount) {
    if (isNaN(amount)) return "";
    const formatted = `$${Math.abs(amount).toFixed(2)}`;
    return amount < 0 ? (
      <span style={{ color: "red" }}>-{formatted}</span>
    ) : (
      <span style={{ color: "green" }}>{formatted}</span>
    );
  }

  // ONLY top 4
  const recentTransactions = transactions.slice(0, 4);

  return (
    <div id="main-container">
      <div id="card-container">
        <div id="card">
          {/* Front of Card */}
          <div id="front">
            <div className="reflection"></div>
            <div className="type">
              <i>Venture Studio</i>
            </div>
            <div className="title-text">
              <img
                src="https://companieslogo.com/img/orig/COF_BIG.D-bf4ccef2.svg?t=1720244491&download=true"
                alt="Capital One Logo"
                style={{ height: "50px" }}
              />
            </div>
            <div className="details">
              <div className="name">John Doe</div>
              <p id="hidden-number">1111 xxxx xxxx 1452</p>
            </div>
            <button id="show-btn">View Card Details</button>
            <div className="logo">MasterCard</div>
          </div>

          {/* Back of Card */}
          <div id="back">
            <div className="reflection"></div>
            <div id="chip">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
            <div className="title-text">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/98/Capital_One_logo.svg"
                alt="Capital One Logo"
                style={{ height: "40px" }}
              />
            </div>
            <div className="details">
              <div className="name">John Doe</div>
              <p id="hidden-number">1111 1223 1223 1452</p>
              <span id="cvv">CW: 482</span>
              <span id="valid-date">Expiry: 07/35</span>
            </div>
            <button id="hide-btn">Hide Card Details</button>
            <div className="logo">MasterCard</div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div id="transactions-container">
        <h1>Recent Transactions</h1>
        {recentTransactions.length === 0 ? (
          <p>Loading transactions...</p>
        ) : (
          recentTransactions.map((tx, idx) => (
            <div className="transaction" key={idx}>
              <span className="transaction-date">{formatDate(tx.TransactionDate)}</span>
              <span className="transaction-description">{tx.TransactionName}</span>
              <span className="transaction-amount">{formatAmount(tx.TransactionAmount)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CreditCard;
