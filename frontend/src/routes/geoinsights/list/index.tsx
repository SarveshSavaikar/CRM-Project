import React, { useState } from "react";
import { Card, Typography, Button } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { useNavigate } from "react-router-dom"; // <-- New Import

const timeOptions: string[] = ["Last 30 days", "Last 7 days", "This Month", "Last Month"];
const regionOptions: string[] = ["North America", "Europe", "Asia", "South America", "Africa"];

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

// Company marker data (India-focused)
type CompanyMarker = {
  name: string;
  coordinates: [number, number];
  count: number;
};

const companyMarkers: CompanyMarker[] = [
  { name: "Mumbai", coordinates: [72.8777, 19.076], count: 3 },
  { name: "Bangalore", coordinates: [77.5946, 12.9716], count: 2 },
  { name: "New Delhi", coordinates: [77.209, 28.6139], count: 1 },
  { name: "Chennai", coordinates: [80.2707, 13.0827], count: 1 },
  { name: "Kolkata", coordinates: [88.3639, 22.5726], count: 1 },
];

export function GeoInsightsPage(): JSX.Element {
  const [selectedTime, setSelectedTime] = useState<string>(timeOptions[0]);
  const [selectedRegion, setSelectedRegion] = useState<string>(regionOptions[0]);
  const navigate = useNavigate(); // <-- New Line

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
        background: "#f5f6fb",
        padding: "32px 36px",
      }}
    >
      {/* Header + Filters */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontWeight: 700, fontSize: 27, margin: 0, flex: 1 }}>Geo Insights</h1>

        {/* Time Filter */}
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
              padding: "8px 6px",
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
        </div>

        {/* Region Filter */}
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
              padding: "8px 6px",
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
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 22, marginBottom: 33 }}>
        <div style={{ background: "#fff", borderRadius: 14, flex: 1, padding: "18px 24px", boxShadow: "0 1px 6px #dde3f1" }}>
          <div style={{ color: "#7c819a", fontSize: 14, marginBottom: 5 }}>Total Leads Mapped</div>
          <div style={{ fontWeight: 700, fontSize: 26, color: "#22274a" }}>7,890</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, flex: 1, padding: "18px 24px", boxShadow: "0 1px 6px #dde3f1" }}>
          <div style={{ color: "#7c819a", fontSize: 14, marginBottom: 5 }}>Average Conversion Rate</div>
          <div style={{ fontWeight: 700, fontSize: 26, color: "#22274a" }}>15.3%</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, flex: 1, padding: "18px 24px", boxShadow: "0 1px 6px #dde3f1" }}>
          <div style={{ color: "#7c819a", fontSize: 14, marginBottom: 5 }}>Top Performing Region</div>
          <div style={{ fontWeight: 700, fontSize: 22, color: "#22274a" }}>North America</div>
        </div>
      </div>

      {/* NEW INDIA MAP CARD */}
      <Card
        title={
          <span style={{ display: "flex", alignItems: "center" }}>
            <GlobalOutlined style={{ marginRight: 8 }} />
            <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
              Leads Distribution
            </Typography.Text>
          </span>
        }
        extra={
          <Button size="small" onClick={() => navigate('/leads')}> {/* <-- Modified Line */}
            See all leads
          </Button>
        }
        style={{ minHeight: 550, overflow: "hidden" }}
        bodyStyle={{ padding: 0, height: 400 }}
      >
        <div style={{ width: "100%", height: 560 }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [78.9629, 23.5937], scale: 700 }}
            width={800}
            height={560}
            style={{ width: "100%", height: "560px", background: "#f7fafc" }}
          >
            <ZoomableGroup zoom={1} minZoom={1} maxZoom={6}>
              <Geographies geography={geoUrl}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                    const isIndia = geo.properties.name === "India";
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: { fill: isIndia ? "#dbf0f7" : "#e9ecef", outline: "none" },
                          hover: { fill: "#b5e2ef", outline: "none" },
                          pressed: { fill: "#63c9db", outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>

              {companyMarkers.map(({ name, coordinates, count }, idx) => (
                <Marker key={idx} coordinates={coordinates}>
                  <circle
                    r={count > 1 ? 20 : 8}
                    fill="#12b3c4"
                    stroke="#fff"
                    strokeWidth={2}
                    style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,.09))", opacity: 0.93 }}
                  />
                  {count > 1 && (
                    <text textAnchor="middle" y={5} style={{ fill: "#fff", fontWeight: 600, fontSize: 16 }}>
                      {count}
                    </text>
                  )}
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </Card>
    </div>
  );
}

export default GeoInsightsPage;