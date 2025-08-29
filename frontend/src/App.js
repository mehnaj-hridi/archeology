import React, { useState } from "react";

function App() {
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
    </div>
  );
}

export default App;
