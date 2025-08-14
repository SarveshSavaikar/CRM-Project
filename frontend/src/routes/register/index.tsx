import { Form, Input, Button, Select, Typography, Card } from "antd";
import { useRegister } from "@refinedev/core";

const { Title, Text } = Typography;
const { Option } = Select;

// Define a type for the form values
interface RegisterFormValues {
  email: string;
  role: string;
  password: string;
  "confirm-password": string; // Note: The field name is a string literal
}

export const RegisterPage = () => {
  const { mutate: register } = useRegister();

  // Explicitly type the 'values' parameter
  const onFinish = (values: RegisterFormValues) => {
    register(values);
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
          <Title level={3}>Refine Project</Title>
        </div>
        <Form
          name="register-form"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
          {/* Email field */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your Email!" },
              { type: "email", message: "The input is not a valid E-mail!" },
            ]}
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
            rules={[
              { required: true, message: "Please input your Password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          {/* Confirm Password field */}
          <Form.Item
            label="Confirm Password"
            name="confirm-password"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your Password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords that you entered do not match!"));
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          {/* Register button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        {/* "Already have an account?" link */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Text type="secondary">
            Already have an account? <a href="/login">Sign in</a>
          </Text>
        </div>
      </Card>
    </div>
  );
};