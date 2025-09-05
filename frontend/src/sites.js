import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

export default function Sites() {
  const [sites, setSites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/sites", { credentials: "include" })
      .then((res) => {
        if (res.status === 401) navigate("/"); 
        return res.json();
      })
      .then((data) => setSites(data))
      .catch((err) => console.error(err));
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Archaeological Sites</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {sites.map((site) => (
            <div key={site.site_id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{site.name}</h2>
              <p className="text-sm text-gray-600">{site.era}</p>
              <p className="mt-2">{site.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
