import React from "react";
import { Card, List, Space, Typography, Tag } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  CalendarOutlined,
  MailOutlined,
} from "@ant-design/icons";

type Activity = {
  icon: React.ReactNode;
  text: string;
  time: string;
};

type Task = {
  text: string;
};

type Completed = {
  text: string;
};

const activities: Activity[] = [
  {
    icon: <PhoneOutlined style={{ color: "#1677ff" }} />,
    text: "Follow up with Acme Corp",
    time: "10:00 AM",
  },
  {
    icon: <CalendarOutlined style={{ color: "#52c41a" }} />,
    text: "Project X kickoff with Dev Team",
    time: "02:00 PM",
  },
  {
    icon: <MailOutlined style={{ color: "#faad14" }} />,
    text: "Send proposal to Beta Ltd",
    time: "04:00 PM",
  },
];

const overdue: Task[] = [
  { text: "Review Q1 performance with John D." },
  { text: "Prepare client success story" },
];

const completed: Completed[] = [
  { text: "Onboarding call with New Client A" },
  { text: "Closed Deal C with Sarah P." },
];

export const TaskActivityTracker: React.FC = () => (
  <Card
    style={{ marginTop: 16 }}
    title="Task & Activity Tracker"
    bodyStyle={{ padding: "0 1rem 1rem 1rem" }}
  >
    {/* Today's Activities */}
    <List
      size="small"
      header={<span style={{ fontWeight: 500 }}>Today's Activities</span>}
      dataSource={activities}
      renderItem={item => (
        <List.Item>
          <Space>
            {item.icon} {item.text}
          </Space>
          <Typography.Text type="secondary" style={{ marginLeft: "auto" }}>
            {item.time}
          </Typography.Text>
        </List.Item>
      )}
    />

    {/* Overdue Tasks */}
    <List
      size="small"
      style={{ marginTop: 8 }}
      header={<span style={{ color: "#d4380d", fontWeight: 500 }}>Overdue Tasks</span>}
      dataSource={overdue}
      renderItem={item => (
        <List.Item>
          <Space>
            <ClockCircleOutlined style={{ color: "#faad14" }} />
            <span style={{ color: "#d4380d" }}>{item.text}</span>
            <Tag color="red" style={{ marginLeft: 8 }}>Overdue</Tag>
          </Space>
        </List.Item>
      )}
    />

    {/* Recently Completed */}
    <List
      size="small"
      style={{ marginTop: 8 }}
      header={<span style={{ color: "#389e0d", fontWeight: 500 }}>Recently Completed</span>}
      dataSource={completed}
      renderItem={item => (
        <List.Item>
          <Space>
            <CheckCircleOutlined style={{ color: "#389e0d" }} />
            <span style={{ color: "#389e0d" }}>{item.text}</span>
            <Tag color="green" style={{ marginLeft: 8 }}>Today</Tag>
          </Space>
        </List.Item>
      )}
    />
  </Card>
);

export default TaskActivityTracker;
