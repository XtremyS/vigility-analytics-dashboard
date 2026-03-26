"use client";

import { useEffect, useMemo, useState } from "react";
import { App, Card, DatePicker, Empty, Select, Spin, Typography } from "antd";
import dayjs from "dayjs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { loadFilters, saveFilters } from "@/lib/cookies";
import { api } from "@/services/api";
import { AnalyticsResponse } from "@/types";

type Props = {
  token: string;
};

export default function Dashboard({ token }: Props) {
  const { message } = App.useApp();
  const [startDate, setStartDate] = useState("2026-03-01");
  const [endDate, setEndDate] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [featureName, setFeatureName] = useState("");
  const [analytics, setAnalytics] = useState<AnalyticsResponse>({ bar_data: [], line_data: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  const filterState = useMemo(
    () => ({ startDate, endDate, ageGroup, gender }),
    [startDate, endDate, ageGroup, gender]
  );

  const track = async (feature: string) => {
    try {
      await api.post(
        "/track",
        { feature_name: feature },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (_error) {
      message.error("Could not track this interaction.");
    }
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/analytics", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          start_date: startDate,
          end_date: endDate,
          age_group: ageGroup || undefined,
          gender: gender || undefined,
          feature_name: featureName || undefined
        }
      });
      setAnalytics(response.data);
    } catch (_error) {
      message.error("Could not fetch analytics data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const persisted = loadFilters();
    const today = new Date().toISOString().split("T")[0];
    setStartDate(persisted?.startDate ?? "2026-03-01");
    setEndDate(persisted?.endDate ?? today);
    setAgeGroup(persisted?.ageGroup ?? "");
    setGender(persisted?.gender ?? "");
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveFilters(filterState);
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState, featureName, isHydrated]);

  return (
    <>
      <Card title="Filters">
        <div className="row">
          <DatePicker
            value={startDate ? dayjs(startDate) : null}
            onChange={(date) => {
              setStartDate(date ? date.format("YYYY-MM-DD") : startDate);
              track("date_filter");
            }}
          />
          <DatePicker
            value={endDate ? dayjs(endDate) : null}
            onChange={(date) => {
              setEndDate(date ? date.format("YYYY-MM-DD") : endDate);
              track("date_filter");
            }}
          />
          <Select
            value={ageGroup}
            onChange={(e) => {
              setAgeGroup(e);
              track("age_filter");
            }}
            options={[
              { value: "", label: "All Ages" },
              { value: "<18", label: "<18" },
              { value: "18-40", label: "18-40" },
              { value: ">40", label: ">40" }
            ]}
            style={{ minWidth: 140 }}
          />
          <Select
            value={gender}
            onChange={(e) => {
              setGender(e);
              track("gender_filter");
            }}
            options={[
              { value: "", label: "All Genders" },
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" }
            ]}
            style={{ minWidth: 160 }}
          />
        </div>
      </Card>

      <Card title="Feature Usage (Bar Chart)">
        {isLoading ? (
          <div className="chart-empty">
            <Spin />
          </div>
        ) : analytics.bar_data.length === 0 ? (
          <div className="chart-empty">
            <Empty description="No bar chart data for selected filters" />
          </div>
        ) : (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.bar_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="feature_name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="total_clicks"
                  fill="#2563eb"
                  onClick={(data) => {
                    setFeatureName(data.feature_name);
                    track(`bar_chart_click_${data.feature_name}`);
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card
        title="Time Trend (Line Chart)"
        extra={
          featureName ? (
            <Typography.Text type="secondary">Selected: {featureName}</Typography.Text>
          ) : null
        }
      >
        {isLoading ? (
          <div className="chart-empty">
            <Spin />
          </div>
        ) : analytics.line_data.length === 0 ? (
          <div className="chart-empty">
            <Empty description="Select a feature bar to view trend" />
          </div>
        ) : (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.line_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bucket" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </>
  );
}
