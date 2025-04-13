import React, { useState, useEffect } from "react";
import CreditCard from "./CreditCard";
import Header from "./Header";
import Map from "./Map";
import Table from "./Table";
import initialTableData from "./SampleData";
import { fetchRecentTransactions } from "./RecentTransactions"; // <<-- Import the function

const Home = () => {
  const [tableData, setTableData] = useState(initialTableData);
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadTransactions() {
      const fetched = await fetchRecentTransactions();
      setTransactions(fetched);
    }
    loadTransactions();
  }, []);

  return (
    <div className="container">
      <Header />
      <CreditCard transactions={transactions} />
      <Map setTableData={setTableData} />
      <Table data={tableData} />
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default Home;
