import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [nid, setNid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nid, password })
      });
      const data = await res.json();
      if (data.status === "success") {
        navigate("/sites");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <input
        type="text"
        placeholder="NID"
        value={nid}
        onChange={(e) => setNid(e.target.value)}
        className="p-3 mb-4 w-64 rounded border border-gray-300"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-3 mb-4 w-64 rounded border border-gray-300"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Login
      </button>
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
