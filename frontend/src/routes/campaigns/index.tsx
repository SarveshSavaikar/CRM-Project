import React, { useState, useEffect } from "react";

// Define the type for valid channel names
type Channel = "All" | "Email" | "LinkedIn" | "WhatsApp";

// Dummy data remains the same
export const allChannelStats: Record<Channel, { label: string; value: string; change: number; }[]> = {
  All: [
    { label: "Total Sent", value: "5,125,780", change: 11.2 },
    { label: "Total Opened", value: "1,120,456", change: 9.8 },
    { label: "Total Clicked", value: "225,912", change: 8.5 },
    { label: "Website Visits", value: "3,876,543", change: 14.1 },
    { label: "Social Mentions", value: "45,890", change: 22.5 },
    { label: "Total Bounced", value: "20,432", change: -2.1 },
  ],
  Email: [
    { label: "Emails Sent", value: "2,567,890", change: 15.2 },
    { label: "Emails Opened", value: "510,123", change: 12.8 },
    { label: "Emails Clicked", value: "105,789", change: 10.5 },
    { label: "Emails Bounced", value: "10,432", change: -3.1 },
  ],
  LinkedIn: [
    { label: "Impressions", value: "1,850,000", change: 8.1 },
    { label: "Clicks", value: "95,000", change: 7.2 },
    { label: "Conversions", value: "3,120", change: 5.5 },
    { label: "Leads", value: "1,500", change: 6.8 },
  ],
  WhatsApp: [
    { label: "Messages Sent", value: "707,890", change: 9.4 },
    { label: "Read Receipts", value: "480,500", change: 8.9 },
    { label: "Replies", value: "35,900", change: 6.5 },
    { label: "Opt-Outs", value: "2,120", change: -1.5 },
  ],
};

export const allChannelCostRev: Record<Channel, { month: string; cost: number; revenue: number; }[]> = {
  All: [
    { month: "Jan-25", cost: 25000, revenue: 50000 },
    { month: "Feb-25", cost: 30000, revenue: 55000 },
    { month: "Mar-25", cost: 35000, revenue: 60000 },
    { month: "Apr-25", cost: 40000, revenue: 65000 },
    { month: "May-25", cost: 45000, revenue: 70000 },
    { month: "Jun-25", cost: 50000, revenue: 75000 },
    { month: "Jul-25", cost: 55000, revenue: 80000 },
    { month: "Aug-25", cost: 60000, revenue: 85000 },
    { month: "Sep-25", cost: 65000, revenue: 90000 },
    { month: "Oct-25", cost: 70000, revenue: 95000 },
    { month: "Nov-25", cost: 75000, revenue: 100000 },
    { month: "Dec-25", cost: 80000, revenue: 105000 },
    { month: "Jan-26", cost: 85000, revenue: 110000 },
    { month: "Feb-26", cost: 90000, revenue: 115000 },
    { month: "Mar-26", cost: 95000, revenue: 120000 },
    { month: "Apr-26", cost: 100000, revenue: 125000 },
    { month: "May-26", cost: 105000, revenue: 130000 },
    { month: "Jun-26", cost: 110000, revenue: 135000 },
    { month: "Jul-26", cost: 115000, revenue: 140000 },
    { month: "Aug-26", cost: 120000, revenue: 145000 },
    { month: "Sep-26", cost: 125000, revenue: 150000 },
    { month: "Oct-26", cost: 130000, revenue: 155000 },
    { month: "Nov-26", cost: 135000, revenue: 160000 },
    { month: "Dec-26", cost: 140000, revenue: 165000 },
  ],
  Email: [
    { month: "Jan-25", cost: 12000, revenue: 22000 },
    { month: "Feb-25", cost: 16000, revenue: 27000 },
    { month: "Mar-25", cost: 15000, revenue: 32000 },
    { month: "Apr-25", cost: 18000, revenue: 33000 },
    { month: "May-25", cost: 20000, revenue: 37000 },
    { month: "Jun-25", cost: 22000, revenue: 35000 },
    { month: "Jul-25", cost: 25000, revenue: 40000 },
    { month: "Aug-25", cost: 27000, revenue: 42000 },
    { month: "Sep-25", cost: 29000, revenue: 46000 },
    { month: "Oct-25", cost: 31000, revenue: 50000 },
    { month: "Nov-25", cost: 34000, revenue: 53000 },
    { month: "Dec-25", cost: 37000, revenue: 58000 },
    { month: "Jan-26", cost: 39000, revenue: 61000 },
    { month: "Feb-26", cost: 41000, revenue: 64000 },
    { month: "Mar-26", cost: 43000, revenue: 67000 },
    { month: "Apr-26", cost: 45000, revenue: 70000 },
    { month: "May-26", cost: 47000, revenue: 73000 },
    { month: "Jun-26", cost: 49000, revenue: 76000 },
    { month: "Jul-26", cost: 51000, revenue: 79000 },
    { month: "Aug-26", cost: 53000, revenue: 82000 },
    { month: "Sep-26", cost: 55000, revenue: 85000 },
    { month: "Oct-26", cost: 57000, revenue: 88000 },
    { month: "Nov-26", cost: 59000, revenue: 91000 },
    { month: "Dec-26", cost: 61000, revenue: 94000 },
  ],
  LinkedIn: [
    { month: "Jan-25", cost: 8000, revenue: 18000 },
    { month: "Feb-25", cost: 9000, revenue: 21000 },
    { month: "Mar-25", cost: 11000, revenue: 25000 },
    { month: "Apr-25", cost: 13000, revenue: 28000 },
    { month: "May-25", cost: 15000, revenue: 32000 },
    { month: "Jun-25", cost: 17000, revenue: 34000 },
    { month: "Jul-25", cost: 19000, revenue: 38000 },
    { month: "Aug-25", cost: 20000, revenue: 41000 },
    { month: "Sep-25", cost: 22000, revenue: 45000 },
    { month: "Oct-25", cost: 24000, revenue: 48000 },
    { month: "Nov-25", cost: 26000, revenue: 51000 },
    { month: "Dec-25", cost: 28000, revenue: 55000 },
    { month: "Jan-26", cost: 30000, revenue: 58000 },
    { month: "Feb-26", cost: 32000, revenue: 61000 },
    { month: "Mar-26", cost: 34000, revenue: 64000 },
    { month: "Apr-26", cost: 36000, revenue: 67000 },
    { month: "May-26", cost: 38000, revenue: 70000 },
    { month: "Jun-26", cost: 40000, revenue: 73000 },
    { month: "Jul-26", cost: 42000, revenue: 76000 },
    { month: "Aug-26", cost: 44000, revenue: 79000 },
    { month: "Sep-26", cost: 46000, revenue: 82000 },
    { month: "Oct-26", cost: 48000, revenue: 85000 },
    { month: "Nov-26", cost: 50000, revenue: 88000 },
    { month: "Dec-26", cost: 52000, revenue: 91000 },
  ],
  WhatsApp: [
    { month: "Jan-25", cost: 5000, revenue: 10000 },
    { month: "Feb-25", cost: 5000, revenue: 7000 },
    { month: "Mar-25", cost: 9000, revenue: 8000 },
    { month: "Apr-25", cost: 9000, revenue: 4000 },
    { month: "May-25", cost: 10000, revenue: 7000 },
    { month: "Jun-25", cost: 11000, revenue: 6000 },
    { month: "Jul-25", cost: 11000, revenue: 5000 },
    { month: "Aug-25", cost: 13000, revenue: 2000 },
    { month: "Sep-25", cost: 14000, revenue: 4000 },
    { month: "Oct-25", cost: 15000, revenue: 7000 },
    { month: "Nov-25", cost: 15000, revenue: 8000 },
    { month: "Dec-25", cost: 15000, revenue: 11000 },
    { month: "Jan-26", cost: 16000, revenue: 12000 },
    { month: "Feb-26", cost: 17000, revenue: 13000 },
    { month: "Mar-26", cost: 18000, revenue: 14000 },
    { month: "Apr-26", cost: 19000, revenue: 15000 },
    { month: "May-26", cost: 20000, revenue: 16000 },
    { month: "Jun-26", cost: 21000, revenue: 17000 },
    { month: "Jul-26", cost: 22000, revenue: 18000 },
    { month: "Aug-26", cost: 23000, revenue: 19000 },
    { month: "Sep-26", cost: 24000, revenue: 20000 },
    { month: "Oct-26", cost: 25000, revenue: 21000 },
    { month: "Nov-26", cost: 26000, revenue: 22000 },
    { month: "Dec-26", cost: 27000, revenue: 23000 },
  ],
};

export const topTemplates = [
  { name: "Holiday Promo 2023", open: "25.4%", click: "4.1%", conversions: 1250 },
  { name: "New Product Launch", open: "28.1%", click: "5.3%", conversions: 1870 },
  { name: "Weekly Newsletter", open: "22.9%", click: "3.8%", conversions: 980 },
  { name: "Customer Feedback Survey", open: "18.7%", click: "2.5%", conversions: 720 },
  { name: "Welcome Series - Part 1", open: "35.2%", click: "6.8%", conversions: 2100 },
];

export const initialCampaigns = [
  {
    name: "Summer Sale Blast",
    channel: "Email",
    startDate: "2025-07-01",
    endDate: "2025-07-31",
    description: "Promotional campaign for summer products.",
  },
  {
    name: "Q3 Newsletter",
    channel: "Email",
    startDate: "2025-08-01",
    endDate: "2025-09-30",
    description: "Quarterly update for subscribers.",
  },
  {
    name: "Product Demo",
    channel: "LinkedIn",
    startDate: "2025-08-15",
    endDate: "2025-08-25",
    description: "Ad campaign for a new software feature.",
  },
  {
    name: "Holiday Specials",
    channel: "WhatsApp",
    startDate: "2025-11-20",
    endDate: "2025-12-25",
    description: "Special offers for the holiday season.",
  },
  {
    name: "Customer Survey",
    channel: "Email",
    startDate: "2025-08-20",
    endDate: "2025-09-10",
    description: "Feedback collection from recent buyers.",
  },
  {
    name: "New Service Announcement",
    channel: "LinkedIn",
    startDate: "2025-09-01",
    endDate: "2025-09-15",
    description: "Announcement of new consulting services.",
  },
  {
    name: "Welcome Series - 2",
    channel: "Email",
    startDate: "2025-09-05",
    endDate: "2025-09-12",
    description: "Onboarding for new customers.",
  },
  {
    name: "Winter Promotion",
    channel: "Email",
    startDate: "2025-12-01",
    endDate: "2025-12-31",
    description: "Discount campaign for winter products.",
  },
  {
    name: "Client Webinar Series",
    channel: "LinkedIn",
    startDate: "2026-01-15",
    endDate: "2026-02-15",
    description: "Series of webinars for key clients.",
  },
  {
    name: "Spring Collection Launch",
    channel: "Email",
    startDate: "2026-03-01",
    endDate: "2026-03-20",
    description: "Launch of new product line.",
  },
  {
    name: "User Feedback Drive",
    channel: "WhatsApp",
    startDate: "2026-04-10",
    endDate: "2026-05-10",
    description: "Collecting user feedback via direct messages.",
  },
  {
    name: "Refer-a-Friend Campaign",
    channel: "Email",
    startDate: "2026-05-01",
    endDate: "2026-06-30",
    description: "Incentivize customer referrals.",
  },
  {
    name: "LinkedIn Pulse Ad",
    channel: "LinkedIn",
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    description: "Targeted ads for industry leaders.",
  },
  {
    name: "Q2 Report Summary",
    channel: "Email",
    startDate: "2026-07-01",
    endDate: "2026-07-15",
    description: "Summary of Q2 performance sent to investors.",
  },
  {
    name: "New Partner Onboarding",
    channel: "WhatsApp",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    description: "Automated message series for new partners.",
  },
  {
    name: "Fall Product Teaser",
    channel: "Email",
    startDate: "2026-09-01",
    endDate: "2026-09-15",
    description: "Pre-launch campaign for new fall products.",
  },
  {
    name: "LinkedIn Lead Gen",
    channel: "LinkedIn",
    startDate: "2026-09-10",
    endDate: "2026-10-10",
    description: "Targeted ad campaign to generate new leads.",
  },
  {
    name: "October Customer Check-in",
    channel: "Email",
    startDate: "2026-10-01",
    endDate: "2026-10-31",
    description: "Regular check-in to boost engagement.",
  },
  {
    name: "Year-End Sale",
    channel: "WhatsApp",
    startDate: "2026-11-15",
    endDate: "2026-12-31",
    description: "Promotional campaign for end-of-year sales.",
  },
  {
    name: "Annual Client Survey",
    channel: "Email",
    startDate: "2026-12-01",
    endDate: "2026-12-20",
    description: "Collecting annual client feedback.",
  },
  {
    name: "Q4 Business Update",
    channel: "LinkedIn",
    startDate: "2026-12-05",
    endDate: "2026-12-15",
    description: "Sharing business milestones with professional network.",
  },
  {
    name: "New Year Offer",
    channel: "WhatsApp",
    startDate: "2027-01-01",
    endDate: "2027-01-15",
    description: "Special offer to start the new year.",
  },
    {
    name: "February Loyalty Program",
    channel: "Email",
    startDate: "2027-02-01",
    endDate: "2027-02-28",
    description: "Exclusive rewards for loyal customers.",
  },
  {
    name: "March Product Series",
    channel: "Email",
    startDate: "2027-03-01",
    endDate: "2027-03-31",
    description: "Showcasing a different product each week.",
  },
  {
    name: "Early Bird Offer",
    channel: "LinkedIn",
    startDate: "2027-03-10",
    endDate: "2027-03-31",
    description: "Discount on early sign-ups for a new service.",
  },
];

export function CampaignAnalyticsDashboard(): JSX.Element {
  const [filteredCostRev, setFilteredCostRev] = useState(allChannelCostRev.All);
  const [filteredStats, setFilteredStats] = useState(allChannelStats.All);
  const [allCampaigns, setAllCampaigns] = useState(initialCampaigns);
  const [filteredCampaigns, setFilteredCampaigns] = useState(allCampaigns);
  const [channelFilter, setChannelFilter] = useState<Channel>("All");
  const [durationFilter, setDurationFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // This single useEffect hook manages all filtering based on the dropdowns.
  useEffect(() => {
    // 1. Filter Campaign Stats
    setFilteredStats(allChannelStats[channelFilter]);

    // 2. Filter Cost vs. Revenue Graph Data
    let costRevData = allChannelCostRev[channelFilter];
    if (durationFilter !== "All") {
      const numMonths = parseInt(durationFilter.split(" ")[1], 10);
      costRevData = costRevData.slice(-numMonths);
    }
    setFilteredCostRev(costRevData);

    // 3. Filter Current Campaigns Table
    const today = new Date();
    // First, filter out expired campaigns based on their end date
    const currentCampaigns = allCampaigns.filter(campaign => {
      const campaignEndDate = new Date(campaign.endDate);
      return campaignEndDate >= today;
    });

    // Then, apply the channel and duration filters to the non-expired campaigns
    const campaignsFiltered = currentCampaigns.filter((campaign) => {
      const channelMatch = channelFilter === "All" || campaign.channel === channelFilter;

      if (durationFilter === "All") {
        return channelMatch;
      } else {
        const numMonths = parseInt(durationFilter.split(" ")[1], 10);
        const startDateThreshold = new Date();
        startDateThreshold.setMonth(today.getMonth() - numMonths);
        const campaignStartDate = new Date(campaign.startDate);
        
        const dateMatch =
          (campaignStartDate >= startDateThreshold && campaignStartDate <= today) ||
          campaignStartDate > today;
        return channelMatch && dateMatch;
      }
    });

    setFilteredCampaigns(campaignsFiltered);
  }, [channelFilter, durationFilter, allCampaigns]);

  const handleAddCampaign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newCampaign = {
      name: form.campaignName.value,
      channel: form.channel.value,
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      description: form.description.value,
    };
    setAllCampaigns(prev => [...prev, newCampaign]);
    setIsModalOpen(false); // Close the modal
    form.reset(); // Reset the form fields

    // Reset filters to show the newly added campaign immediately
    setChannelFilter("All");
    setDurationFilter("All");
  };

  // Calculate maximum value for dynamic scaling of bars
  const maxValue = Math.max(...filteredCostRev.map((d) => Math.max(d.cost, d.revenue)));
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
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value as Channel)}
          style={{
            marginRight: 14,
            padding: "7px 10px",
            borderRadius: 6,
            border: "1px solid #edf2ff",
            fontWeight: 500,
          }}
        >
          <option value="All">All Channels</option>
          <option value="Email">Email</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="WhatsApp">WhatsApp</option>
        </select>
        <select
          value={durationFilter}
          onChange={(e) => setDurationFilter(e.target.value)}
          style={{
            marginRight: 16,
            padding: "7px 10px",
            borderRadius: 6,
            border: "1px solid #edf2ff",
            fontWeight: 500,
          }}
        >
          <option>All</option>
          <option>Last 12 Months</option>
          <option>Last 6 Months</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "flex", gap: 18, marginBottom: 30 }}>
        {filteredStats.map((stat) => (
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
                color: stat.change > 0 ? "#1ebd7b" : "#ff4d4f",
                marginTop: 2,
              }}
            >
              {stat.change > 0 ? `↑${stat.change}` : `↓${Math.abs(stat.change)}`}%
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
            viewBox={`0 0 ${filteredCostRev.length * 40 + 60} 260`}
            style={{ overflow: "visible" }}
          >
            {/* Horizontal grid lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={i}
                x1={40}
                y1={200 - i * 35}
                x2={filteredCostRev.length * 40 + 20}
                y2={200 - i * 35}
                stroke="#e3e7ef"
              />
            ))}
            {/* Dynamic Bars */}
            {filteredCostRev.map((dat, idx) => {
              const costHeight = (dat.cost / maxValue) * maxHeight;
              const revHeight = (dat.revenue / maxValue) * maxHeight;
              const x = 50 + idx * 40;
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
                    y={210}
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
            <rect x={50} y={240} width={16} height={10} fill="#3871f9" />
            <text x={70} y={250} fontSize={12} fill="#22274a">
              Campaign Cost
            </text>
            <rect x={180} y={240} width={16} height={10} fill="#69d277" />
            <text x={200} y={250} fontSize={12} fill="#22274a">
              Campaign Revenue
            </text>
          </svg>
        </div>
      </div>

      {/* New Current Campaigns Section and Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 13,
          boxShadow: "0 1px 8px #dde3f1",
          padding: 22,
          marginTop: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            Current Campaigns
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: "#3871f9",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Add Campaign
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
            <thead>
              <tr style={{ background: "#f5f8fa" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px 5px",
                    color: "#3871f9",
                    width: "20%",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "8px 5px",
                    color: "#3871f9",
                    width: "15%",
                  }}
                >
                  Channel
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "8px 5px",
                    color: "#3871f9",
                    width: "15%",
                  }}
                >
                  Start Date
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "8px 5px",
                    color: "#3871f9",
                    width: "15%",
                  }}
                >
                  End Date
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px 5px",
                    color: "#3871f9",
                    width: "35%",
                  }}
                >
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign, index) => (
                  <tr key={campaign.name + index} style={{ borderTop: "1px solid #f1f2f6", fontSize: 15 }}>
                    <td style={{ padding: "10px 5px" }}>{campaign.name}</td>
                    <td style={{ textAlign: "center" }}>{campaign.channel}</td>
                    <td style={{ textAlign: "center" }}>{campaign.startDate}</td>
                    <td style={{ textAlign: "center" }}>{campaign.endDate}</td>
                    <td style={{ padding: "10px 5px" }}>{campaign.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                    No campaigns found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay and Box */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "24px 30px",
              borderRadius: 12,
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              minWidth: 400,
              maxWidth: 500,
              position: "relative",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 20 }}>Add New Campaign</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 24,
                  cursor: "pointer",
                  color: "#aaa",
                }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddCampaign}>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>Campaign Name:</label>
                <input
                  type="text"
                  name="campaignName"
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>Channel:</label>
                <select
                  name="channel"
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #ccc" }}
                >
                  <option value="Email">Email</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 15, marginBottom: 15 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>Start Date:</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>End Date:</label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #ccc" }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 5, fontWeight: 500 }}>Description:</label>
                <textarea
                  name="description"
                  required
                  style={{
                    width: "100%",
                    height: 80,
                    padding: "8px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    resize: "none",
                  }}
                ></textarea>
              </div>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#3871f9",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Add Campaign
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignAnalyticsDashboard;