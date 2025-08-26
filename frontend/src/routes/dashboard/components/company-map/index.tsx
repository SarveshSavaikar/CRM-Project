import React from "react";
import { Card, Typography, Button } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // <-- New import
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

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
  { name: "Goa", coordinates: [15.2993, 74.124], count: 7 },
];

export const CompaniesMapCard: React.FC = () => {
  const navigate = useNavigate(); // <-- New line

  return (
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
        <Button size="small" type="default" onClick={() => navigate("/leads")}>
          {" "}
          {/* <-- Modified line */}
          See all leads
        </Button>
      }
      style={{ minHeight: 550, overflow: "hidden" }} // ⬅️ taller card
      bodyStyle={{ padding: 0, height: 400 }} // ⬅️ more space for map
    >
      <div style={{ width: "100%", height: 560 }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: [78.9629, 23.5937], // Keep India in center
            scale: 700, // ⬅️ Smaller scale so world is visible
          }}
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
                        default: {
                          fill: isIndia ? "#dbf0f7" : "#e9ecef", // India highlighted
                          outline: "none",
                        },
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
                  style={{
                    filter: "drop-shadow(0 0 4px rgba(0,0,0,.09))",
                    opacity: 0.93,
                  }}
                />
                {count > 1 && (
                  <text
                    textAnchor="middle"
                    y={5}
                    style={{ fill: "#fff", fontWeight: 600, fontSize: 16 }}
                  >
                    {count}
                  </text>
                )}
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </Card>
  );
};

export default CompaniesMapCard;
