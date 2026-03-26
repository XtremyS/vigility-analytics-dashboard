"use client";

import { App, ConfigProvider } from "antd";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 10
        }
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
