import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { getSessions } from "../api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Analytics({ sessionData }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setLoadError("");
      const data = await getSessions();
      if (!active) return;
      if (!Array.isArray(data)) {
        setLoadError("Failed to load analytics from the database.");
        setSessions([]);
      } else {
        setSessions(data);
      }
      setLoading(false);
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    // Group sessions by date
    const dailyData = {};
    const monthlyData = {};

    sessions.forEach((session) => {
      const date = session.date;
      const month = date.substring(0, 7); // YYYY-MM

      // Accumulate daily
      if (!dailyData[date]) {
        dailyData[date] = { focus: 0, break: 0 };
      }
      dailyData[date].focus += session.focusDuration;
      dailyData[date].break += session.breakDuration;

      // Accumulate monthly
      if (!monthlyData[month]) {
        monthlyData[month] = { focus: 0, break: 0 };
      }
      monthlyData[month].focus += session.focusDuration;
      monthlyData[month].break += session.breakDuration;
    });

    return { dailyData, monthlyData };
  }, [sessions]);

  // Get last 7 days for daily chart
  const last7Days = useMemo(() => {
    const labels = [];
    const dataFocus = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      labels.push(dateStr);
      const minutes =
        Math.round(
          ((stats.dailyData[dateStr]?.focus || 0) / 60) * 100
        ) / 100;
      dataFocus.push(minutes);
    }

    return { labels, dataFocus };
  }, [stats.dailyData]);

  // Get all months for monthly chart
  const allMonths = useMemo(() => {
    const labels = [];
    const dataFocus = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().substring(0, 7);
      labels.push(monthStr);
      const minutes =
        Math.round(
          ((stats.monthlyData[monthStr]?.focus || 0) / 60) * 100
        ) / 100;
      dataFocus.push(minutes);
    }

    return { labels, dataFocus };
  }, [stats.monthlyData]);

  const dailyChartData = {
    labels: last7Days.labels,
    datasets: [
      {
        label: "Focus Time (minutes)",
        data: last7Days.dataFocus,
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartData = {
    labels: allMonths.labels,
    datasets: [
      {
        label: "Focus Time (minutes)",
        data: allMonths.dataFocus,
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(201, 203, 207, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Minutes",
        },
      },
    },
  };

  // Calculate total stats
  const totalFocusMinutes = Math.round(
    (sessions.reduce((sum, s) => sum + s.focusDuration, 0) / 60) * 100
  ) / 100;
  const totalBreakMinutes = Math.round(
    (sessions.reduce((sum, s) => sum + s.breakDuration, 0) / 60) * 100
  ) / 100;
  const totalSessions = sessions.length;
  const avgFocusPerSession = totalSessions > 0 ? (totalFocusMinutes / totalSessions).toFixed(2) : 0;

  // Today's stat
  const today = new Date().toISOString().split("T")[0];
  const todayFocus = Math.round(
    ((stats.dailyData[today]?.focus || 0) / 60) * 100
  ) / 100;

  return (
    <div className="analytics">
      <h2>Your Analytics</h2>

      {loading && <p>Loading analytics from the database...</p>}
      {!loading && loadError && <p>{loadError}</p>}
      {!loading && !loadError && sessions.length === 0 && (
        <p>No database sessions yet. Complete a session to see analytics.</p>
      )}

      <div className="stats-summary">
        <div className="stat-card">
          <h4>Total Focus Time</h4>
          <p className="stat-value">{totalFocusMinutes} min</p>
        </div>
        <div className="stat-card">
          <h4>Today's Focus</h4>
          <p className="stat-value">{todayFocus} min</p>
        </div>
        <div className="stat-card">
          <h4>Total Sessions</h4>
          <p className="stat-value">{totalSessions}</p>
        </div>
        <div className="stat-card">
          <h4>Avg Focus/Session</h4>
          <p className="stat-value">{avgFocusPerSession} min</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart-container">
          <h3>Last 7 Days</h3>
          <Bar data={dailyChartData} options={chartOptions} />
        </div>

        <div className="chart-container">
          <h3>Last 12 Months</h3>
          <Bar data={monthlyChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
