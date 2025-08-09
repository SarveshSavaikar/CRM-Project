import React from "react";
import { Card, Row, Col, List, Avatar, Typography, Space, Tag } from "antd";
import { AppstoreAddOutlined, CrownTwoTone, UserOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

// 1. Tasks Donut Card Data (replace with actual chart if needed)
const statusColors: Record<string, string> = {
  "Todo": "#BAE0FF",
  "In Progress": "#1677FF",
  "In Review": "#91Caff",
  "Done": "#52C41A"
};

const statusOrder = ["Todo", "In Progress", "In Review", "Done"];

// 2. Sales Team Performance Data
const topSales = [
  {
    name: "Emily Chen",
    leads: 120,
    deals: 15,
    percent: "34.3%",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    isTop: true
  },
  {
    name: "David Kim",
    leads: 110,
    deals: 12,
    percent: "30.2%",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    isTop: false
  },
  {
    name: "Sarah Lee",
    leads: 95,
    deals: 10,
    percent: "28.3%",
    avatar: "https://randomuser.me/api/portraits/women/46.jpg",
    isTop: false
  },
];

//  ----- Main Component -----
export const Generate: React.FC = () => (
  <Row gutter={[32, 32]} justify="center">
    {/* Tasks Overview Donut Card */}
    <Col xs={24} md={12}>
      <Card
        style={{ minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "center" }}
        size="small"
      >
        <Space align="center">
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: "50%", backgroundColor: "#E6F4FF"
          }}>
            <AppstoreAddOutlined style={{ color: "#1677FF", fontSize: 18 }} />
          </div>
          <Typography.Text style={{ fontWeight: 500, marginLeft: 8, color: "#555" }}>
            Tasks overview
          </Typography.Text>
        </Space>
        {/* Replace with live chart if you wish. For now, display a static ring */}
        <div style={{ width: 130, height: 130, margin: "36px auto 16px", borderRadius: "50%", background: "conic-gradient(#BAE0FF 0 25%, #1677FF 0 50%, #91CAFF 0 75%, #52C41A 0 100%)", border: "16px solid #fff", boxSizing: "border-box" }} />
        {/* Legend */}
        <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
          {statusOrder.map(status => (
            <div key={status} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: statusColors[status]
              }} />
              <Typography.Text style={{ fontSize: 13, color: "#4A5568" }}>{status}</Typography.Text>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", marginTop: 8 }}>
          <Typography.Title level={2} style={{ margin: 0, fontWeight: 700 }}>
            20
          </Typography.Title>
          <Typography.Text style={{ marginLeft: 4, color: "#888" }}>total</Typography.Text>
        </div>
      </Card>
    </Col>

    {/* Sales Team Performance Card */}
    <Col xs={24} md={12}>
      <Card
        style={{ minHeight: 320 }}
        title="Sales Team Performance"
        extra={<Typography.Link style={{ fontSize: 13 }}>View All Sales Reps</Typography.Link>}
        bodyStyle={{ padding: "0 1rem 1rem 1rem" }}
        size="small"
      >
        <List
          itemLayout="horizontal"
          dataSource={topSales}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} icon={<UserOutlined />} />}
                title={
                  <Space>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    {item.isTop && <CrownTwoTone twoToneColor="#faad14" />}
                  </Space>
                }
                description={
                  <span>
                    Leads: <b>{item.leads}</b> | Deals Closed: <b>{item.deals}</b>
                  </span>
                }
              />
              <span style={{ fontWeight: 500, fontSize: 13, color: "#389e0d" }}>
                {item.percent}
              </span>
            </List.Item>
          )}
        />
      </Card>
    </Col>
  </Row>
);

export default Generate;
