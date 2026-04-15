"use client";

import { useEffect, useState } from "react";
import TotalMoney from "@/components/TotalMoney";
import TellerFunc from "@/components/TellerFunc";
import History from "@/components/History";

export default function Admin1Page() {
  const [loggedInAccountId, setLoggedInAccountId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  useEffect(() => {
    const accountId = localStorage.getItem("loggedInAccountId");
    const userRole = localStorage.getItem("loggedInRole");

    setLoggedInAccountId(accountId);

    if (userRole !== "admin" || accountId !== "admin1") {
      alert("Access denied!");
      window.location.href = "/";
      return;
    }

    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  const actions = [
    { title: "Deposit", type: "deposit" },
    { title: "Withdraw", type: "withdraw" },
    { title: "Transfer", type: "transfer" }, // added transfer
    { title: "History", type: "history" },
    { title: "Logout", type: "logout" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("loggedInAccountId");
    localStorage.removeItem("loggedInRole");
    setActiveComponent("logout");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <main style={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "200px",
          borderRight: "1px solid #ccc",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <h2>Actions</h2>
        {actions.map((action) =>
          action.type === "logout" ? (
            <button
              key={action.type}
              onClick={handleLogout}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              {action.title}
            </button>
          ) : (
            <button
              key={action.type}
              onClick={() => setActiveComponent(action.type)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              {action.title}
            </button>
          )
        )}

        <div style={{ marginTop: "20px" }}>
          <h3>Total Money</h3>
          <TotalMoney />
        </div>
      </aside>

      {/* Scrollable main content */}
      <section
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <h1>Admin Dashboard</h1>
        <p>Welcome, admin1!</p>

        {/* Active component display */}
        {activeComponent === "deposit" && <TellerFunc type="deposit" />}
        {activeComponent === "withdraw" && <TellerFunc type="withdraw" />}
        {activeComponent === "transfer" && <TellerFunc type="transfer" />}
        {activeComponent === "history" && <History />}
        {activeComponent === "logout" && <p>Logging out...</p>}
      </section>
    </main>
  );
}