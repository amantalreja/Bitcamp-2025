import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";


const Header = () => {
  const [isPitchOpen, setIsPitchOpen] = useState(false);

  return (
    <header>
      <h1>Dispute Daddy</h1>
      <nav>
        <button onClick={() => setIsPitchOpen(true)} className="nav-btn">
          Solve Your Dispute
        </button>
        <Link to="/insights">

        </Link>
      </nav>
    </header>
  );
};

export default Header;
