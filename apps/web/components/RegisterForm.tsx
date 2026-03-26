"use client";

import Link from "next/link";
import { useState } from "react";
import { App, Button, Card, Form, Input, InputNumber, Select, Typography } from "antd";

type RegisterValues = {
  username: string;
  password: string;
  age: number;
  gender: "Male" | "Female" | "Other";
};

type Props = {
  onRegistered: (token: string) => void;
};

export default function RegisterForm({ onRegistered }: Props) {
  const { message } = App.useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm<RegisterValues>();

  const handleSubmit = async (values: RegisterValues) => {
    setIsSubmitting(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
      const response = await fetch(`${base}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Registration failed." }));
        message.error(error.detail ?? "Registration failed.");
        return;
      }

      const loginResponse = await fetch(`${base}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: values.username, password: values.password })
      });

      if (!loginResponse.ok) {
        message.success("Account created. Please login.");
        form.resetFields();
        return;
      }

      const loginData = await loginResponse.json();
      message.success("Account created and logged in.");
      onRegistered(loginData.access_token);
    } catch (_error) {
      message.error("Could not register. Check API server status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="auth-card">
      <Typography.Title level={3}>Create Account</Typography.Title>
      <Typography.Paragraph type="secondary">
        Register to start tracking dashboard interactions.
      </Typography.Paragraph>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: "Please enter username" },
            { min: 3, message: "Username must be at least 3 characters" }
          ]}
        >
          <Input placeholder="e.g. raj_user" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please enter password" },
            { min: 6, message: "Password must be at least 6 characters" }
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item name="age" label="Age" rules={[{ required: true, message: "Please enter age" }]}>
          <InputNumber style={{ width: "100%" }} min={1} max={120} placeholder="Enter age" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select gender" }]}
        >
          <Select
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" }
            ]}
            placeholder="Select gender"
          />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={isSubmitting} block>
          Create Account
        </Button>
      </Form>

      <Typography.Paragraph style={{ marginTop: 12 }}>
        Already registered? <Link href="/login">Sign in</Link>
      </Typography.Paragraph>
    </Card>
  );
}
