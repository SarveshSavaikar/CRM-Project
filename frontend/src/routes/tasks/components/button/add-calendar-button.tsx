import React from "react";
import { PlusSquareOutlined } from "@ant-design/icons"; // reusing existing icon
import { Button } from "antd";
import { Text } from "@/components";

export const KanbanOpenCalendarButton: React.FC = () => {
  const handleClick = () => {
    window.location.href = "/tasks/calendar"; // simple navigation without extra imports
  };

  return (
    <Button
      type="primary" // ✅ makes it blue
      size="large"
      icon={<PlusSquareOutlined className="md" />}
      style={{
        margin: "16px",
      }}
      onClick={handleClick}
    >
      <Text size="md" type="secondary" style={{ color: "white" }}>
        Open Calendar
      </Text>
    </Button>
  );
};