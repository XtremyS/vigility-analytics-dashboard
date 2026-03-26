"use client";

import { useEffect, useMemo, useState } from "react";
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

const today = new Date().toISOString().split("T")[0];

export default function Dashboard({ token }: Props) {
  const persisted = loadFilters();
  const [startDate, setStartDate] = useState(persisted?.startDate ?? "2026-03-01");
  const [endDate, setEndDate] = useState(persisted?.endDate ?? today);
  const [ageGroup, setAgeGroup] = useState(persisted?.ageGroup ?? "");
  const [gender, setGender] = useState(persisted?.gender ?? "");
  const [featureName, setFeatureName] = useState("");
  const [analytics, setAnalytics] = useState<AnalyticsResponse>({ bar_data: [], line_data: [] });

  const filterState = useMemo(
    () => ({ startDate, endDate, ageGroup, gender }),
    [startDate, endDate, ageGroup, gender]
  );

  const track = async (feature: string) => {
    await api.post(
      "/track",
      { feature_name: feature },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const fetchAnalytics = async () => {
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
  };

  useEffect(() => {
    saveFilters(filterState);
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState, featureName]);

  return (
    <>
      <div className="card">
        <h2>Filters</h2>
        <div className="row">
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              track("date_filter");
            }}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              track("date_filter");
            }}
          />
          <select
            value={ageGroup}
            onChange={(e) => {
              setAgeGroup(e.target.value);
              track("age_filter");
            }}
          >
            <option value="">All Ages</option>
            <option value="<18">&lt;18</option>
            <option value="18-40">18-40</option>
            <option value=">40">&gt;40</option>
          </select>
          <select
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              track("gender_filter");
            }}
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="card">
        <h2>Feature Usage (Bar Chart)</h2>
        <ResponsiveContainer width="100%" height={280}>
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

      <div className="card">
        <h2>Time Trend (Line Chart)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={analytics.line_data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bucket" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
