import React from "react";
import { Card, List, Skeleton as AntdSkeleton } from "antd";
import { MailOutlined } from "@ant-design/icons"; // Using MailOutlined for inbox context

import { Text } from "@/components";

export const InboxPreview = () => {
  // Hardcoded state for an empty, non-loading component.
  const isLoading = false;
  const data = { data: [] };

  return (
    <Card
      style={{
        height: "100%",
      }}
      headStyle={{ padding: "8px 16px" }}
      bodyStyle={{
        padding: "0 1rem",
      }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <MailOutlined />
          <Text size="sm" style={{ marginLeft: ".7rem" }}>
            Inbox Preview
          </Text>
        </div>
      }
    >
      {isLoading ? (
        // This block will show a skeleton loading state if isLoading were true
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, index) => ({
            id: index,
          }))}
          renderItem={() => (
            <List.Item>
              <List.Item.Meta
                title={
                  <AntdSkeleton.Button
                    active
                    style={{
                      height: "14px",
                    }}
                  />
                }
                description={
                  <AntdSkeleton.Button
                    active
                    style={{
                      width: "300px",
                      marginTop: "8px",
                      height: "16px",
                    }}
                  />
                }
              />
            </List.Item>
          )}
        />
      ) : (
        // The list is intentionally empty and will not render any items.
        <List
          itemLayout="horizontal"
          dataSource={data?.data || []}
          renderItem={() => null}
        />
      )}

      {/* Renders a custom message when there is no data and the component is not loading. */}
      {!isLoading && data?.data.length === 0 && <NoMessages />}
    </Card>
  );
};

const NoMessages = () => (
  <span
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "220px",
    }}
  >
    No messages
  </span>
);

export default InboxPreview;