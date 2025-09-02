import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DonationPage from "./Donation";

function Home() {
  const [message, setMessage] = useState("");

  const testDbConnection = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/test-db");
      const text = await res.text();
      setMessage(text);
    } catch (error) {
      setMessage("Error connecting to backend: " + error.message);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Archeology Frontend</h1>
      <button onClick={testDbConnection}>Check DB Connection</button>
      <p>{message}</p>
      <Link to="/donate" style={{ display: "block", marginTop: "1rem", color: "blue" }}>
        Go to Donation Page
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donate" element={<DonationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
