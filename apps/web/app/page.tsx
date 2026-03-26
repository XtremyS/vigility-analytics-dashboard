"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button, Flex, Spin, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import Dashboard from "@/components/Dashboard";
import { bootstrapAuth, logout } from "@/lib/auth";
import { setUnauthorizedHandler } from "@/services/api";

export default function HomePage() {
  const { message } = App.useApp();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const saved = bootstrapAuth();
    if (!saved) {
      router.replace("/login");
      return;
    }
    setToken(saved);
    setIsBootstrapping(false);
  }, [router]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      message.warning("Session expired. Please login again.");
      router.replace("/login");
    });
  }, [message, router]);

  if (isBootstrapping) {
    return (
      <main className="auth-page">
        <Spin size="large" />
      </main>
    );
  }

  return (
    <main className="container">
      <div className="dashboard-header">
        <div>
          <Typography.Title level={2} style={{ marginBottom: 0 }}>
            Analytics Dashboard
          </Typography.Title>
          <Typography.Text type="secondary">
            Track usage, filter events, and monitor feature trends
          </Typography.Text>
        </div>
        <Button
          icon={<LogoutOutlined />}
          onClick={() => {
            logout();
            message.success("Logged out successfully.");
            router.replace("/login");
          }}
        >
          Logout
        </Button>
      </div>
      <Flex vertical gap={16}>
        <Dashboard token={token} />
      </Flex>
    </main>
  );
}
