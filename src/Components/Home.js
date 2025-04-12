import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreditCard from "./CreditCard";
import Header from "./Header";

const Home = () => {
  // Example invested startups data (initially set)
const [message, setMessage] = useState("");

  return (
    <div className="container">
      <Header/>
      <CreditCard />
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default Home;
