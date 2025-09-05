import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import heroImage from "./assets/hero-archaeology.jpg";
import "./CSS/ticket.css";

const TicketPurchase = () => {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [noOfTickets, setNoOfTickets] = useState(1);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [userTickets, setUserTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/sites", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setSites(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch("http://localhost:5000/tickets/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUserTickets(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedSite) {
      const site = sites.find((s) => s.site_id === parseInt(selectedSite));
      setTicketPrice(site ? site.ticket_price : 0);
    } else {
      setTicketPrice(0);
    }
  }, [selectedSite, sites]);

  const handlePurchase = async () => {
    if (!selectedSite || noOfTickets <= 0) {
      alert("Please select a site and enter a valid number of tickets!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/tickets/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          site_id: selectedSite,
          no_of_tickets: noOfTickets,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        setShowModal(true);
        setUserTickets((prev) => [
          ...prev,
          {
            site_name: sites.find((s) => s.site_id === parseInt(selectedSite))?.name,
            no_of_tickets: noOfTickets,
            ticket_price: ticketPrice,
            total_amount: noOfTickets * ticketPrice,
            purchase_time: new Date().toISOString(),
          },
        ]);
        setSelectedSite("");
        setNoOfTickets(1);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section
        className="hero-section flex items-center justify-center mb-12"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-overlay">
          <h1 className="hero-title">Book Tickets for Archaeological Sites</h1>
          <p className="hero-subtitle">
            Support preservation efforts while exploring ancient heritage.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <div className="form-container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Purchase Tickets</h2>

        {/* Site Selector */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Select Site</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            <option value="">-- Select Site --</option>
            {sites.map((site) => (
              <option key={site.site_id} value={site.site_id}>
                {site.name} (৳{site.ticket_price})
              </option>
            ))}
          </select>
        </div>

        {/* Number of Tickets */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Number of Tickets</label>
          <input
            type="number"
            min={1}
            className="w-full border rounded px-3 py-2"
            value={noOfTickets}
            onChange={(e) => setNoOfTickets(parseInt(e.target.value))}
          />
        </div>

        {/* Total Price */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Total Price (৳)</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 bg-gray-100"
            value={ticketPrice * noOfTickets}
            readOnly
          />
        </div>

        {/* Purchase Button */}
        <button
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-lg shadow hover:from-purple-700 hover:to-purple-800 transition-all"
          onClick={handlePurchase}
        >
          Purchase Tickets
        </button>

        {/* User Tickets */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Your Tickets</h3>
          {userTickets.length > 0 ? (
            <div className="space-y-2">
              {userTickets.map((ticket, idx) => (
                <div key={idx} className="border p-3 rounded flex justify-between items-center">
                  <span>{ticket.site_name} - {ticket.no_of_tickets} tickets</span>
                  <span>৳{ticket.total_amount}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tickets purchased yet.</p>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Purchase Successful!</h2>
            <p>You have successfully purchased your tickets.</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketPurchase;
