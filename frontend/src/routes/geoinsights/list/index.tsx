import React, { useState } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

// Filter options
const timeOptions: string[] = ["Last 30 days", "Last 7 days", "This Month", "Last Month"];
const regionOptions: string[] = ["North America", "Europe", "Asia", "South America", "Africa"];

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

// Map marker data
type MarkerType = {
  name: string;
  coordinates: [number, number];
  count: number;
};
const markers: MarkerType[] = [
  { name: "North America", coordinates: [-98, 39], count: 3 },
  { name: "East Asia/Russia", coordinates: [105, 55], count: 2 },
  { name: "Middle East", coordinates: [45, 25], count: 1 },
  { name: "South America", coordinates: [-60, -15], count: 1 },
  { name: "Sub-Saharan Africa", coordinates: [20, 0], count: 1 },
];

export function GeoInsightsPage(): JSX.Element {
  const [selectedTime, setSelectedTime] = useState<string>(timeOptions[0]);
  const [selectedRegion, setSelectedRegion] = useState<string>(regionOptions[0]);

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        background: "#f5f6fb",
        padding: "32px 36px",
      }}
    >
      {/* Header and filter bar */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontWeight: 700, fontSize: 27, margin: 0, flex: 1, letterSpacing: 0 }}>
          Geo Insights
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            borderRadius: 7,
            boxShadow: "0 1px 6px #e7e9ee",
            marginRight: 16,
          }}
        >
          <span style={{ padding: "0 10px 0 14px", color: "#7c819a" }}>
            {/* Calendar icon */}
            <svg width="21" height="21" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="5" width="14" height="12" rx="2" fill="#edf2ff" />
              <rect x="7" y="2" width="2" height="4" rx="1" fill="#1467fa" />
              <rect x="11" y="2" width="2" height="4" rx="1" fill="#1467fa" />
              <rect x="5" y="9" width="10" height="1.4" rx="0.7" fill="#b6bdcf" />
            </svg>
          </span>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontWeight: 500,
              fontSize: 15,
              color: "#27325b",
              padding: "8px 6px 8px 0",
              appearance: "none",
              minWidth: 110,
              cursor: "pointer",
            }}
          >
            {timeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span style={{ paddingRight: 17, color: "#a8819a" }}>
            {/* Down arrow icon */}
            <svg width="18" height="18" viewBox="0 0 20 20">
              <path d="M6 8l4 4 4-4" stroke="#7b849a" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            borderRadius: 7,
            boxShadow: "0 1px 6px #e7e9ee",
            marginRight: 10,
          }}
        >
          <span style={{ padding: "0 10px 0 14px", color: "#7c819a" }}>
            {/* Globe icon */}
            <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" fill="#edf2ff" />
              <ellipse cx="10" cy="10" rx="6.5" ry="8" stroke="#1467fa" strokeWidth="1.5" />
              <ellipse cx="10" cy="10" rx="8" ry="5.5" stroke="#1467fa" strokeWidth="1.5" />
            </svg>
          </span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontWeight: 500,
              fontSize: 15,
              color: "#27325b",
              padding: "8px 6px 8px 0",
              appearance: "none",
              minWidth: 120,
              cursor: "pointer",
            }}
          >
            {regionOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span style={{ paddingRight: 12, color: "#a8819a" }}>
            {/* Down arrow icon */}
            <svg width="18" height="18" viewBox="0 0 20 20">
              <path d="M6 8l4 4 4-4" stroke="#7b849a" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </span>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{ display: "flex", gap: 22, marginBottom: 33 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            flex: 1,
            minWidth: 210,
            padding: "18px 24px",
            boxShadow: "0 1px 6px #dde3f1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", color: "#7c819a", fontSize: 14, marginBottom: 5 }}>
            {/* Person icon */}
            <svg width="17" height="16" viewBox="0 0 24 24" style={{ marginRight: 7 }}>
              <circle cx="12" cy="8" r="4.5" fill="#1467fa" />
              <rect x="4" y="15" width="16" height="5" rx="2.5" fill="#eef2fd" />
            </svg>
            Total Leads Mapped
          </div>
          <div style={{ fontWeight: 700, fontSize: 26, color: "#22274a", letterSpacing: 0 }}>7,890</div>
          <div style={{ color: "#1ebd7b", fontSize: 13, fontWeight: 500, marginTop: 2 }}>
            ↑12% from last month
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            flex: 1,
            minWidth: 210,
            padding: "18px 24px",
            boxShadow: "0 1px 6px #dde3f1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", color: "#7c819a", fontSize: 14, marginBottom: 5 }}>
            {/* Conversion icon */}
            <svg width="17" height="16" viewBox="0 0 18 18" style={{ marginRight: 7 }}>
              <circle cx="9" cy="9" r="8" fill="#e4f0fc" />
              <path d="M6 8.5l3 3 5-5" stroke="#1ebd7b" strokeWidth="1.5" fill="none" />
            </svg>
            Average Conversion Rate
          </div>
          <div style={{ fontWeight: 700, fontSize: 26, color: "#22274a", letterSpacing: 0 }}>15.3%</div>
          <div style={{ color: "#1ebd7b", fontSize: 13, fontWeight: 500, marginTop: 2 }}>
            ↑1.5% from last month
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            flex: 1,
            minWidth: 210,
            padding: "18px 24px",
            boxShadow: "0 1px 6px #dde3f1",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", color: "#7c819a", fontSize: 14, marginBottom: 5 }}>
            {/* Globe icon */}
            <svg width="17" height="16" viewBox="0 0 20 20" style={{ marginRight: 7 }}>
              <circle cx="10" cy="10" r="8" fill="#edf2ff" />
              <ellipse cx="10" cy="10" rx="6.5" ry="8" stroke="#1467fa" strokeWidth="1.5" />
              <ellipse cx="10" cy="10" rx="8" ry="5.5" stroke="#1467fa" strokeWidth="1.5" />
            </svg>
            Top Performing Region
          </div>
          <div style={{ fontWeight: 700, fontSize: 22, color: "#22274a", letterSpacing: 0 }}>North America</div>
          <div style={{ color: "#7c819a", fontSize: 13, fontWeight: 500, marginTop: 2 }}>
            2,500 Leads, 18% Conv. Rate
          </div>
        </div>
      </div>

      {/* MAP CARD */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          boxShadow: "0 1px 8px #dde6f0",
          padding: 24,
          minHeight: 360,
          position: "relative",
        }}
      >
        <h2
          style={{
            fontWeight: 700,
            fontSize: 18,
            color: "#222",
            marginBottom: 18,
          }}
        >
          Lead Distribution Map
        </h2>
        <ComposableMap
          projectionConfig={{ scale: 130 }}
          width={800}
          height={400}
          style={{ width: "100%", height: "400px", background: "#f7fafb" }}
        >
          <ZoomableGroup zoom={1} minZoom={1} maxZoom={6}>
            <Geographies geography={geoUrl}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: "#dbf0f7", outline: "none" },
                      hover: { fill: "#a9d7e8", outline: "none" },
                      pressed: { fill: "#7ec6e8", outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            {markers.map(({ name, coordinates, count }, i) => (
              <Marker key={i} coordinates={coordinates}>
                <circle
                  r={count > 1 ? 20 : 8}
                  fill="#1491f2"
                  stroke="#fff"
                  strokeWidth={2}
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(20, 145, 242, 0.7))",
                    cursor: "pointer",
                  }}
                >
                  <title>{`${name}: ${count} Leads`}</title>
                </circle>
                {count > 1 && (
                  <text
                    textAnchor="middle"
                    y={5}
                    style={{
                      fill: "#fff",
                      fontWeight: 700,
                      fontSize: 16,
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {count}
                  </text>
                )}
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
}

export default GeoInsightsPage;
