import { Form, Input, Button, Select, Typography, Card } from "antd";
import { useLogin } from "@refinedev/core";

const { Title, Text } = Typography;
const { Option } = Select;

export const LoginPage = () => {
  const { mutate: login } = useLogin();

  const onFinish = (values: any) => {
    login(values);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card style={{ width: 400, padding: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3}>CRM System</Title>
        </div>
        <Form
          name="login-form"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          // requiredMark={false} is removed to keep the asterisk
        >
          {/* Email field */}
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input size="large" />
          </Form.Item>

          {/* Role field (Dropdown menu) */}
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select your Role!" }]}
          >
            <Select size="large" placeholder="Select a role">
              <Option value="admin">Admin</Option>
              <Option value="manager">Manager</Option>
              <Option value="sales-representative">Sales Representative</Option>
              <Option value="marketing">Marketing</Option>
              <Option value="support">Support</Option>
              <Option value="viewer">Viewer</Option>
            </Select>
          </Form.Item>

          {/* Password field */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          {/* Forgot password link */}
          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <a href="/forgot-password">Forgot password?</a>
          </div>

          {/* Sign In button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Sign In
            </Button>
          </Form.Item>
        </Form>

        {/* "Don't have an account?" link */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Text type="secondary">
            Don't have an account? <a href="/register">Sign up</a>
          </Text>
        </div>
      </Card>
    </div>
  );
};