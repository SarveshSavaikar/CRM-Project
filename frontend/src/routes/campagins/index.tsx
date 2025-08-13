import React, { useState, useEffect } from "react";

// Dummy data for the dashboard (replace with API data as needed)
export const initialCampaignCostRev = [
  { month: "Jan", cost: 12000, revenue: 22000 },
  { month: "Feb", cost: 16000, revenue: 27000 },
  { month: "Mar", cost: 15000, revenue: 32000 },
  { month: "Apr", cost: 18000, revenue: 33000 },
  { month: "May", cost: 20000, revenue: 37000 },
  { month: "Jun", cost: 22000, revenue: 35000 },
  { month: "Jul", cost: 25000, revenue: 40000 },
  { month: "Aug", cost: 27000, revenue: 42000 },
  { month: "Sep", cost: 29000, revenue: 46000 },
  { month: "Oct", cost: 31000, revenue: 50000 },
  { month: "Nov", cost: 34000, revenue: 53000 },
  { month: "Dec", cost: 37000, revenue: 58000 },
];

export const campaignStats = [
  { label: "Emails Sent", value: "1,245,678", change: 15.2 },
  { label: "Emails Opened", value: "250,123", change: 12.8 },
  { label: "Emails Clicked", value: "45,789", change: 10.5 },
  { label: "Emails Bounced", value: "5,432", change: 3.1 },
];

export const topTemplates = [
  { name: "Holiday Promo 2023", open: "25.4%", click: "4.1%", conversions: 1250 },
  { name: "New Product Launch", open: "28.1%", click: "5.3%", conversions: 1870 },
  { name: "Weekly Newsletter", open: "22.9%", click: "3.8%", conversions: 980 },
  { name: "Customer Feedback Survey", open: "18.7%", click: "2.5%", conversions: 720 },
  { name: "Welcome Series - Part 1", open: "35.2%", click: "6.8%", conversions: 2100 },
];

export function CampaignAnalyticsDashboard(): JSX.Element {
  const [campaignCostRev, setCampaignCostRev] = useState(initialCampaignCostRev);

  // Example: simulate data update from API after 5 seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCampaignCostRev((prev) =>
        prev.map((d) => (d.month === "Jan" ? { ...d, revenue: d.revenue + 5000 } : d))
      );
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate maximum value for dynamic scaling of bars
  const maxValue = Math.max(...campaignCostRev.map((d) => Math.max(d.cost, d.revenue)));
  const maxHeight = 174; // Maximum height of bars in pixels

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        background: "#f5f5f8",
        padding: "32px 36px",
      }}
    >
      {/* Header & Filters */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
        <h2 style={{ fontWeight: 700, fontSize: 27, flex: 1, margin: 0 }}>Campaign Analytics</h2>
        <select
          style={{
            marginRight: 14,
            padding: "7px 10px",
            borderRadius: 6,
            border: "1px solid #edf2ff",
            fontWeight: 500,
          }}
        >
          <option>Email</option>
        </select>
        <select
          style={{
            marginRight: 16,
            padding: "7px 10px",
            borderRadius: 6,
            border: "1px solid #edf2ff",
            fontWeight: 500,
          }}
        >
          <option>Last 30 Days</option>
        </select>
        <button
          style={{
            background: "#1467fa",
            color: "#fff",
            fontWeight: 600,
            border: "none",
            borderRadius: 7,
            padding: "9px 24px",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Apply Filters
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "flex", gap: 18, marginBottom: 30 }}>
        {campaignStats.map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: 11,
              boxShadow: "0 1px 8px #e7e9ee",
              padding: "22px 30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              minWidth: 180,
            }}
          >
            <span style={{ color: "#8186a0", fontSize: 15, marginBottom: 5 }}>{stat.label}</span>
            <span style={{ fontSize: 25, fontWeight: 700, color: "#22274a" }}>{stat.value}</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#1ebd7b",
                marginTop: 2,
              }}
            >
              ↑{stat.change}%
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 18 }}>
        {/* Top Performing Templates Table */}
        <div
          style={{
            flex: "2 1 340px",
            background: "#fff",
            borderRadius: 13,
            boxShadow: "0 1px 8px #dde3f1",
            padding: 22,
            marginBottom: 24,
            minWidth: 305,
            maxWidth: 420,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>
            Top Performing Templates
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f5f8fa" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px 5px",
                      color: "#3871f9",
                    }}
                  >
                    Template Name
                  </th>
                  <th style={{ color: "#3871f9" }}>Open Rate</th>
                  <th style={{ color: "#3871f9" }}>Click Rate</th>
                  <th style={{ color: "#3871f9" }}>Conversions</th>
                </tr>
              </thead>
              <tbody>
                {topTemplates.map((template) => (
                  <tr
                    key={template.name}
                    style={{ borderTop: "1px solid #f1f2f6", fontSize: 15 }}
                  >
                    <td style={{ padding: "5px 0" }}>{template.name}</td>
                    <td style={{ textAlign: "center" }}>{template.open}</td>
                    <td style={{ textAlign: "center" }}>{template.click}</td>
                    <td style={{ textAlign: "center" }}>{template.conversions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Bar Graph */}
        <div
          style={{
            flex: "3 1 340px",
            background: "#fff",
            borderRadius: 13,
            boxShadow: "0 1px 8px #dde3f1",
            padding: 22,
            marginBottom: 24,
             minHeight: 390,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>
            Cost vs Revenue (CAC)
          </div>
          <svg
            width="100%"
            height="260"
            viewBox="0 0 500 260"
            style={{ overflow: "visible" }}
          >
            {/* Horizontal grid lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={i}
                x1={40}
                y1={200 - i * 35}
                x2={480}
                y2={200 - i * 35}
                stroke="#e3e7ef"
              />
            ))}
            {/* Dynamic Bars */}
            {campaignCostRev.map((dat, idx) => {
              const costHeight = (dat.cost / maxValue) * maxHeight;
              const revHeight = (dat.revenue / maxValue) * maxHeight;
              const x = 50 + idx * 30;
              return (
                <g key={dat.month}>
                  <rect
                    x={x}
                    y={200 - costHeight}
                    width={10}
                    height={costHeight}
                    fill="#3871f9"
                    rx={2}
                  />
                  <rect
                    x={x + 12}
                    y={200 - revHeight}
                    width={10}
                    height={revHeight}
                    fill="#69d277"
                    rx={2}
                  />
                  <text
                    x={x + 7}
                    y={270}  // Pushed down to prevent overlap
                    fontSize="10"
                    fill="#7f8a9c"
                    textAnchor="middle"
                  >
                    {dat.month}
                  </text>
                </g>
              );
            })}
            {/* Legend below bars */}
            <rect x={100} y={290} width={16} height={10} fill="#3871f9" />
            <text x={120} y={300} fontSize={12} fill="#22274a">
              Campaign Cost
            </text>
            <rect x={250} y={290} width={16} height={10} fill="#69d277" />
            <text x={270} y={300} fontSize={12} fill="#22274a">
              Campaign Revenue
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default CampaignAnalyticsDashboard;
