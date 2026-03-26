"use client";

import Link from "next/link";
import { useState } from "react";
import { App, Button, Card, Form, Input, Typography } from "antd";

type Props = {
  onLoggedIn: (token: string) => void;
};

export default function LoginForm({ onLoggedIn }: Props) {
  const { message } = App.useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm<{ username: string; password: string }>();

  const handleSubmit = async (values: { username: string; password: string }) => {
    setIsSubmitting(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
      const response = await fetch(`${base}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      if (!response.ok) {
        message.error("Invalid username or password.");
        return;
      }
      const data = await response.json();
      onLoggedIn(data.access_token);
      message.success("Logged in successfully.");
    } catch (_error) {
      message.error("Could not login. Check API server status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="auth-card">
      <Typography.Title level={3}>Sign In</Typography.Title>
      <Typography.Paragraph type="secondary">
        Access your analytics dashboard.
      </Typography.Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ username: "user_1", password: "password123" }}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please enter username" }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter password" }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmitting} block>
          Login
        </Button>
      </Form>
      <Typography.Paragraph style={{ marginTop: 12 }}>
        No account? <Link href="/register">Create one</Link>
      </Typography.Paragraph>
    </Card>
  );
}
