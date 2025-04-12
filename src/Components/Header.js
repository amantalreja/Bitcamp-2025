import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";


const Header = () => {
  const [isPitchOpen, setIsPitchOpen] = useState(false);

  return (
    <header>
      <h1>Hackalytics - Startup Investment</h1>
      <nav>
        <button onClick={() => setIsPitchOpen(true)} className="nav-btn">
          Pitch Your Startup
        </button>
        <Link to="/insights">
          Go to Insights
        </Link>
      </nav>
    </header>
  );
};

export default Header;
