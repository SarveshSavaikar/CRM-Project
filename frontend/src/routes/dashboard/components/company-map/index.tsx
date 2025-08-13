import React from "react";
import { Card, Typography, Button } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
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
  { name: "USA/Canada", coordinates: [-100, 45], count: 3 },
  { name: "China", coordinates: [105, 35], count: 2 },
  { name: "Germany", coordinates: [10, 50], count: 1 },
  { name: "Middle East", coordinates: [45, 25], count: 1 },
  { name: "Nigeria", coordinates: [8, 9], count: 1 },
  { name: "Brazil", coordinates: [-55, -10], count: 1 },
  { name: "Russia", coordinates: [100, 60], count: 1 },
];

export const CompaniesMapCard: React.FC = () => (
  <Card
    title={
      <span style={{ display: "flex", alignItems: "center" }}>
        <GlobalOutlined style={{ marginRight: 8 }} />
        <Typography.Text style={{ fontWeight: 500, fontSize: 16 }}>
          Companies
        </Typography.Text>
      </span>
    }
    extra={
      <Button size="small" type="default">
        See all companies
      </Button>
    }
    style={{ minHeight: 360, overflow: "hidden" }}
    bodyStyle={{ padding: 0, height: 340 }}
  >
    <div style={{ width: "100%", height: 340 }}>
      <ComposableMap
        projectionConfig={{ scale: 130 }}
        width={700}
        height={340}
        style={{ width: "100%", height: "340px", background: "#f7fafc" }}
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
                    hover: { fill: "#b5e2ef", outline: "none" },
                    pressed: { fill: "#63c9db", outline: "none" },
                  }}
                />
              ))
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

export default CompaniesMapCard;
