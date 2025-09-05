import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Sites from "./sites";
import Donation from "./Donation";
import TicketPurchase from "./ticket"; // new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sites" element={<Sites />} />
        <Route path="/donate" element={<Donation />} />
        <Route path="/ticket-purchase" element={<TicketPurchase />} /> {/* new route */}
      </Routes>
    </Router>
  );
}

export default App;
