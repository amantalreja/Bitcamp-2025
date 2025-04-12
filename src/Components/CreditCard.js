import React, { useEffect } from "react";
import "./CreditCard.css";

const CreditCard = () => {
  useEffect(() => {
    // Function to update card details randomly on each flip
    function updateCardDetails() {
      // Generate a masked card number for the front and a full version for the back.
      let maskedNumber = "1111 xxxx xxxx 1452";
      let fullNumber = "1111 ";
      // Generate two random groups of four digits
      for (let i = 0; i < 2; i++) {
        let part = Math.floor(Math.random() * 9000 + 1000);
        fullNumber += part + " ";
      }
      fullNumber += "1452";

      // Update both front (masked) and back (full) numbers
      const frontNumberEl = document.querySelector("#front #hidden-number");
      const backNumberEl = document.querySelector("#back #hidden-number");
      if (frontNumberEl) frontNumberEl.textContent = maskedNumber;
      if (backNumberEl) backNumberEl.textContent = fullNumber;

      // Generate random CVV (3 digits)
      let cvv = Math.floor(Math.random() * 900 + 100);
      const cvvEl = document.getElementById("cvv");
      if (cvvEl) cvvEl.textContent = "CW: " + cvv;

      // Generate random expiry date (MM/YY)
      let month = ("0" + (Math.floor(Math.random() * 12) + 1)).slice(-2);
      let year = Math.floor(Math.random() * 10 + 23); // e.g., from 23 to 32
      const validDateEl = document.getElementById("valid-date");
      if (validDateEl) validDateEl.textContent = "Expiry: " + month + "/" + year;

      // Update cardholder name (for both front and back)
      const nameEls = document.querySelectorAll(".name");
      nameEls.forEach(el => {
        el.textContent = "John Doe"; // Replace with a random name generator if desired.
      });

      // Update bank logo in .title-text (for both sides)
      const titleTextEls = document.querySelectorAll(".title-text");
      titleTextEls.forEach(el => {
        el.innerHTML =
          '<img src="https://companieslogo.com/img/orig/COF_BIG.D-bf4ccef2.svg?t=1720244491&download=true" alt="Capital One Logo" style="height:50px;">';
      });

      // Update card type if needed
      const typeEls = document.querySelectorAll(".type");
      typeEls.forEach(el => {
        // Use innerHTML to allow HTML tags (like <i>) to render
        el.innerHTML = "<i>Venture Studio</i>";
      });
    }

    // Flip function toggles the flip animation and updates card details.
    function flip() {
      const cardEl = document.getElementById("card");
      if (cardEl) {
        cardEl.classList.toggle("flipped");
      }
      const frontReflection = document.querySelector("#front .reflection");
      const backReflection = document.querySelector("#back .reflection");
      if (frontReflection) frontReflection.classList.toggle("move");
      if (backReflection) backReflection.classList.toggle("move");

      // Update all card details upon flipping.
      updateCardDetails();
    }

    // Attach event listeners to both buttons.
    const showBtn = document.getElementById("show-btn");
    const hideBtn = document.getElementById("hide-btn");

    if (showBtn) showBtn.addEventListener("click", flip);
    if (hideBtn) hideBtn.addEventListener("click", flip);

    // Cleanup event listeners on unmount.
    return () => {
      if (showBtn) showBtn.removeEventListener("click", flip);
      if (hideBtn) hideBtn.removeEventListener("click", flip);
    };
  }, []);

  return (
    <div id="main-container">
      <div id="card-container">
        {/* Card content */}
        <div id="card">
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
              <p id="hidden-number">1111 xxxxx xxxxx 1452</p>
            </div>
            <button id="show-btn">View Card Details</button>
            <div className="logo">MasterCard</div>
          </div>
          <div id="back">
            <div className="reflection"></div>
            <div id="chip">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
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
      <div id="transactions-container">
        <h1>Transactions</h1>
        <div className="transaction">
          <span className="transaction-date">2023-12-01</span>
          <span className="transaction-description">Payment Received</span>
          <span className="transaction-amount">$120.00</span>
        </div>
        <div className="transaction">
          <span className="transaction-date">2023-11-28</span>
          <span className="transaction-description">Subscription Fee</span>
          <span className="transaction-amount">-$9.99</span>
        </div>
        <div className="transaction">
          <span className="transaction-date">2023-11-28</span>
          <span className="transaction-description">Subscription Fee</span>
          <span className="transaction-amount">-$9.99</span>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
