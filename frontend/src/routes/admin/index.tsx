import React, { useState, ChangeEvent } from "react";
import {
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  UploadOutlined,
  AreaChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FilterOutlined,
  TeamOutlined,
  DeploymentUnitOutlined,
  AppstoreAddOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SyncOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";

// --- Dashboard Filter Controls ---
interface DashboardFilterControlsProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardFilterControls: React.FC<DashboardFilterControlsProps> = ({
  darkMode,
  setDarkMode,
}) => (
  <div
    style={{
      border: `1px solid ${darkMode ? "#444" : "#eee"}`,
      padding: 24,
      borderRadius: 12,
      marginBottom: 32,
      background: darkMode ? "#1e1e1e" : "#fff",
      display: "flex",
      gap: 24,
      flexWrap: "wrap",
    }}
  >
    {[
      { label: "Time Range", options: ["Last 7 Days", "Last 30 Days", "This Month", "This Year"] },
      { label: "Team", options: ["All Teams", "Sales", "Marketing"] },
      { label: "Campaign", options: ["All Campaigns", "Q3 Launch", "Black Friday"] },
    ].map((filter) => (
      <div key={filter.label} style={{ flex: 1, minWidth: 200 }}>
        <label style={{ fontWeight: 500, color: darkMode ? "#ddd" : "#000" }}>{filter.label}</label>
        <br />
        <select
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 6,
            marginTop: 6,
            background: darkMode ? "#2b2b2b" : "#fff",
            color: darkMode ? "#ddd" : "#000",
            border: `1px solid ${darkMode ? "#555" : "#ccc"}`,
          }}
        >
          {filter.options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>
    ))}
    {/* Region dropdown and Theme Toggle */}
    <div style={{ flex: 1, minWidth: 240, display: "flex", alignItems: "center", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <label style={{ fontWeight: 500, color: darkMode ? "#ddd" : "#000" }}>Region</label>
        <br />
        <select
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 6,
            marginTop: 6,
            background: darkMode ? "#2b2b2b" : "#fff",
            color: darkMode ? "#ddd" : "#000",
            border: `1px solid ${darkMode ? "#555" : "#ccc"}`,
          }}
        >
          <option>All Regions</option>
          <option>North America</option>
          <option>Europe</option>
        </select>
      </div>
      {/* Theme Toggle beside region */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 25,
          border: `1px solid ${darkMode ? "#555" : "#eee"}`,
          borderRadius: 8,
          padding: "6px 14px",
          background: darkMode ? "#2b2b2b" : "#fafbfd",
          userSelect: "none",
          cursor: "pointer",
        }}
        onClick={() => setDarkMode(!darkMode)}
        role="checkbox"
        aria-checked={darkMode}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setDarkMode(!darkMode);
        }}
      >
        <span style={{ marginRight: 8, fontSize: 17 }}>{darkMode ? "🌙" : "🌞"}</span>
        <label
          style={{
            marginRight: 10,
            fontWeight: 500,
            fontSize: 15,
            color: darkMode ? "#ddd" : "#000",
          }}
        >
          Dark Mode
        </label>
        <label
          style={{
            display: "inline-block",
            position: "relative",
            width: 34,
            height: 20,
          }}
        >
          <input
            type="checkbox"
            checked={darkMode}
            readOnly
            style={{ opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
          />
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: darkMode ? "#377afd" : "#eceef2",
              borderRadius: 14,
              transition: "background 0.2s",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: darkMode ? 16 : 2,
                top: 2,
                width: 16,
                height: 16,
                background: "#fff",
                borderRadius: "50%",
                transition: "left 0.2s",
              }}
            />
          </span>
        </label>
      </div>
    </div>
  </div>
);

// --- Contact Types & Data ---
type Contact = {
  name: string;
  title: string;
  role: "Sales Manager" | "Sales Person";
  avatarUrl?: string;
};

const contacts: Contact[] = [
  { name: "Michael Scott", title: "Central Mobility Specialist", role: "Sales Manager", avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg" },
  { name: "Meredith Palmer", title: "Senior Factors Coordinator", role: "Sales Person", avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg" },
  { name: "Jim Halpert", title: "Central Optimization Executive", role: "Sales Person", avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg" },
  { name: "Dwight Schrute", title: "Internal Intranet Facilitator", role: "Sales Manager", avatarUrl: "https://randomuser.me/api/portraits/men/4.jpg" },
];

const badgeColor = (dark: boolean, role: Contact["role"]) =>
  role === "Sales Manager"
    ? { color: "#169E6C", background: dark ? "#113f2e" : "#E6F9F1" }
    : { color: "#537FE7", background: dark ? "#2b386e" : "#F2F5FB" };

const ContactsTable: React.FC<{ darkMode: boolean }> = ({ darkMode }) => (
  <table
    style={{
      width: "100%",
      background: darkMode ? "#2b2b2b" : "#fff",
      borderRadius: 8,
      color: darkMode ? "#ddd" : "#000",
      borderCollapse: "separate",
      borderSpacing: 0,
    }}
  >
    <thead>
      <tr>
        {["Name", "Title", "Role"].map((header) => (
          <th
            key={header}
            style={{
              textAlign: "left",
              padding: 8,
              fontWeight: 600,
              color: darkMode ? "#88b4ff" : "#377afd",
              borderBottom: darkMode ? "1px solid #444" : "1px solid #eef0f2",
            }}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {contacts.map((c, idx) => (
        <tr
          key={c.name}
          style={{
            borderBottom: idx !== contacts.length - 1 ? `1px solid ${darkMode ? "#444" : "#eef0f2"}` : "none",
          }}
        >
          <td style={{ padding: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src={c.avatarUrl}
              alt={c.name}
              style={{ width: 28, height: 28, borderRadius: "50%" }}
            />
            {c.name}
          </td>
          <td style={{ padding: 8 }}>{c.title}</td>
          <td style={{ padding: 8 }}>
            <span
              style={{
                ...badgeColor(darkMode, c.role),
                padding: "2px 12px",
                borderRadius: 16,
                fontWeight: 600,
                fontSize: 13,
                display: "inline-block",
              }}
            >
              {c.role}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// --- Custom Widget Button ---
interface CustomWidgetButtonProps {
  icon: React.ReactNode;
  label: string;
}
const CustomWidgetButton: React.FC<CustomWidgetButtonProps> = ({ icon, label }) => (
  <div
    style={{
      background: "#fafcff",
      border: "1.5px solid #e6e9f1",
      borderRadius: 10,
      padding: "18px 24px 12px 24px",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 7,
      minWidth: 128,
      minHeight: 75,
      transition: "box-shadow 0.12s, border 0.12s",
      userSelect: "none",
    }}
    tabIndex={0}
    aria-label={label}
  >
    {icon}
    <span style={{ fontWeight: 500, color: "#2a3253", fontSize: 15 }}>{label}</span>
  </div>
);

// --- Widget Customization (SINGLE definition) ---
const WidgetCustomization: React.FC<{ darkMode: boolean }> = ({ darkMode }) => (
  <div
    style={{
      background: darkMode ? "#2b2b2b" : "#fff",
      borderRadius: 12,
      boxShadow: darkMode ? "0 2px 16px #111" : "0 2px 16px #e6e9f1",
      padding: 28,
      color: darkMode ? "#ddd" : "#222",
      width: "100%",
      maxWidth: 800,
      marginRight: "auto",
      marginLeft: 0,
      minWidth: 340,
    }}
  >
    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 18 }}>Widget Customization</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginBottom: 18 }}>
      {[
        { icon: <AreaChartOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "Sales Overview" },
        { icon: <PieChartOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "Lead Source" },
        { icon: <LineChartOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "Revenue Trend" },
        { icon: <FilterOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "Task Progress" },
        { icon: <TeamOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "Team Performance" },
        { icon: <DeploymentUnitOutlined style={{ fontSize: 24, color: "#377afd" }} />, label: "Deal Stages" },
      ].map(({ icon, label }) => (
        <CustomWidgetButton key={label} icon={icon} label={label} />
      ))}
    </div>
    <button
      style={{
        border: "1px solid #377afd",
        color: "#377afd",
        borderRadius: 8,
        background: darkMode ? "#1a1a2e" : "#f6f7fb",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        fontWeight: 600,
        gap: 8,
        fontSize: 15,
        cursor: "pointer",
      }}
    >
      <AppstoreAddOutlined />
      Add New Widget
    </button>
  </div>
);

// --- CompanyCard with Logo Upload ---
const CompanyCard: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [logo, setLogo] = useState<string | null>(null);
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") setLogo(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div
      style={{
        background: darkMode ? "#2b2b2b" : "#fff",
        borderRadius: 12,
        boxShadow: darkMode ? "0 2px 16px #111" : "0 2px 16px #e6e9f1",
        padding: 32,
        flex: 5,
        minWidth: 650,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ position: "relative" }}>
          <img
            src={logo || "https://cdn-icons-png.flaticon.com/512/431/431803.png"}
            alt="Globex Logo"
            style={{
              width: 52,
              height: 52,
              borderRadius: 8,
              border: `1px solid ${darkMode ? "#444" : "#e6e9f1"}`,
              background: darkMode ? "#1e1e1e" : "#fafbfc",
              objectFit: "cover",
            }}
          />
          <label
            htmlFor="logo-upload"
            style={{
              position: "absolute",
              right: -12,
              bottom: -12,
              background: darkMode ? "#333" : "#377afd",
              color: "#fff",
              borderRadius: "50%",
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            <UploadOutlined />
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleUpload}
            />
          </label>
        </div>
        <div>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 22, color: darkMode ? "#fff" : "#2d3648" }}>
            Globex Corporation
          </h2>
          <span style={{ color: darkMode ? "#aaa" : "#888", fontWeight: 500, fontSize: 14 }}>
            CRM Platform
          </span>
        </div>
      </div>
      <ContactsTable darkMode={darkMode} />
    </div>
  );
};

// --- Company Info Card ---
const CompanyInfoCard: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const infoColor = darkMode ? "#ddd" : "#222";
  const labelColor = darkMode ? "#aaa" : "#777";
  const borderColor = darkMode ? "#444" : "#eef0f2";

  return (
    <div
      style={{
        background: darkMode ? "#2b2b2b" : "#fff",
        borderRadius: 12,
        boxShadow: darkMode ? "0 2px 16px #111" : "0 2px 16px #e6e9f1",
        padding: 32,
        flex: 3,
        minWidth: 500,
        color: infoColor,
      }}
    >
      <h3 style={{ margin: 0, fontWeight: 600, fontSize: 20, marginBottom: 10, color: infoColor }}>
        Company info
      </h3>
      {[
        { icon: <HomeOutlined />, label: "Address", value: "2158 Mount Tabor, Westbury, New York, USA 11590" },
        { icon: <PhoneOutlined />, label: "Phone", value: "+123 456 789 01 23" },
        { icon: <MailOutlined />, label: "Email", value: "info@globex.com" },
        { icon: <GlobalOutlined />, label: "Website", value: "www.globex.com" },
      ].map((item, idx, arr) => (
        <React.Fragment key={item.label}>
          <div style={{ display: "flex", alignItems: "start", gap: 16, padding: "12px 0" }}>
            <div style={{ color: "#377afd", fontSize: 22 }}>{item.icon}</div>
            <div>
              <div style={{ color: labelColor, fontSize: 13, fontWeight: 500 }}>{item.label}</div>
              <div style={{ color: infoColor, fontSize: 15, fontWeight: 500 }}>{item.value}</div>
            </div>
          </div>
          {idx !== arr.length - 1 && <div style={{ borderBottom: `1px solid ${borderColor}`, width: "100%" }} />}
        </React.Fragment>
      ))}
    </div>
  );
};

// --- System Alerts card matching your image ---
interface AlertItem {
  label: string;
  status: "connected" | "disconnected" | "syncing";
  lastSync: string;
}
const alerts: AlertItem[] = [
  {
    label: "Mail API",
    status: "connected",
    lastSync: "2024-07-26 14:30"
  },
  {
    label: "Call API",
    status: "disconnected",
    lastSync: "2024-07-26 10:15"
  },
  {
    label: "CRM Sync",
    status: "syncing",
    lastSync: "2024-07-26 15:05"
  },
  {
    label: "Analytics Data",
    status: "connected",
    lastSync: "2024-07-26 15:10"
  }
];

const statusDisplay: Record<
  AlertItem["status"],
  { text: string; color: string; icon: React.ReactNode; bg: string }
> = {
  connected: {
    text: "Connected",
    color: "#32be6a",
    icon: <CheckCircleOutlined />,
    bg: "#e8f8ef"
  },
  disconnected: {
    text: "Disconnected",
    color: "#fff",
    icon: <DisconnectOutlined />,
    bg: "#f96868"
  },
  syncing: {
    text: "Syncing...",
    color: "#377afd",
    icon: <SyncOutlined spin />,
    bg: "#e5f0ff"
  }
};

const SystemAlerts: React.FC<{ darkMode: boolean }> = ({ darkMode }) => (
  <div
    style={{
      background: darkMode ? "#2b2b2b" : "#fff",
      borderRadius: 12,
      boxShadow: darkMode ? "0 2px 16px #111" : "0 2px 16px #e6e9f1",
      padding: 28,
      marginBottom: 0,
      maxWidth: 390,
      width: "100%",
      minWidth: 275,
      color: darkMode ? "#fff" : "#1a2433",
      display: "flex",
      flexDirection: "column",
      gap: 0
    }}
  >
    <div style={{ fontWeight: 700, fontSize: 19, marginBottom: 14 }}>
      System Alerts
    </div>
    {alerts.map((a, idx) => {
      const d = statusDisplay[a.status];
      return (
        <div
          key={a.label}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "18px 12px",
            borderBottom:
              idx !== alerts.length - 1
                ? `1px solid ${darkMode ? "#444" : "#eff2f9"}`
                : "none"
          }}
        >
          <div style={{ flex: 1, fontWeight: 500 }}>{a.label}</div>
          <div
            style={{
              marginRight: 12,
              fontWeight: 600,
              background: a.status === "disconnected" ? "#f96868" : d.bg,
              color: a.status === "disconnected" ? "#fff" : d.color,
              borderRadius: 6,
              padding: "5px 13px",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 7
            }}
          >
            {d.icon}
            <span>{d.text}</span>
          </div>
          <div
            style={{
              fontSize: 13,
              color: darkMode
                ? "#bbb"
                : a.status === "disconnected"
                ? "#f96868"
                : "#7c7d9c",
              minWidth: 98,
              textAlign: "right"
            }}
          >
            Last sync:<br />
            <span style={{ fontWeight: 600 }}>{a.lastSync}</span>
          </div>
        </div>
      );
    })}
  </div>
);

// --- Main Page ---
export const AdminSettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        background: darkMode ? "#121212" : "#f5f5f8",
        padding: "32px 12px",
        color: darkMode ? "#fff" : "#000",
      }}
    >
      <h1 style={{ fontWeight: 700, fontSize: 32, marginBottom: 32 }}>Admin / Settings</h1>
      <DashboardFilterControls darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Row: Globex Card + Company Info */}
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: 32,
          alignItems: "flex-start",
          overflowX: "auto",
          marginBottom: 32, // space before widgets+alerts row
        }}
      >
        <CompanyCard darkMode={darkMode} />
        <CompanyInfoCard darkMode={darkMode} />
      </div>

      {/* Row: Widgets + System Alerts BESIDE each other */}
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          gap: 32,
          alignItems: "flex-start",
          overflowX: "auto",
        }}
      >
        <WidgetCustomization darkMode={darkMode} />
        <SystemAlerts darkMode={darkMode} />
      </div>
    </div>
  );
};

export default AdminSettingsPage;
