// src/components/Reports.js
import React, { useState, useEffect } from "react";
import api from "../api";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";

const Reports = () => {
  const [sales, setSales] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [chartData, setChartData] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "" });

  useEffect(() => {
    // Load sales data once on mount
    async function loadSales() {
      try {
        const salesRes = await api.get("/sales");
        setSales(salesRes.data);
      } catch (err) {
        console.error(err);
        showAlert("error", "Failed to load sales data");
      }
    }
    loadSales();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3500);
  };

  const loadReport = () => {
    if (!fromDate || !toDate) {
      showAlert("error", "Please select both From and To dates.");
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      showAlert("error", "'From' date cannot be after 'To' date.");
      return;
    }

    const filteredSales = sales.filter((s) => {
      const saleDate = new Date(s.date);
      return saleDate >= new Date(fromDate) && saleDate <= new Date(toDate);
    });

    const aggregate = {};

    filteredSales.forEach((s) => {
      const dateKey = new Date(s.date).toISOString().split("T")[0];
      if (!aggregate[dateKey]) aggregate[dateKey] = 0;
      aggregate[dateKey] += s.quantity;
    });

    const data = Object.entries(aggregate)
      .map(([date, quantity]) => ({ date, quantity }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setChartData(data);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-yellow-600">📊 Sales Reports</h2>
        <Link
          to="/sales"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition"
        >
          ← Back to Sales Entry
        </Link>
      </div>

      {alert.message && (
        <div
          className={`mb-6 px-4 py-3 rounded-md text-white font-semibold ${
            alert.type === "success" ? "bg-green-500" : "bg-red-500"
          } animate-fade-in`}
          role="alert"
        >
          {alert.message}
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <div>
          <label htmlFor="fromDate" className="block font-semibold mb-1">
            From:
          </label>
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="toDate" className="block font-semibold mb-1">
            To:
          </label>
          <input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>

        <button
          onClick={loadReport}
          className="self-end bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition"
        >
          Load Report
        </button>
      </div>

      {chartData.length > 0 ? (
        <>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Line Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="quantity"
                stroke="#F59E0B"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>

          <h3 className="text-xl font-bold text-gray-800 mt-8 mb-2">Bar Chart Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#F59E0B" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p className="text-gray-600">No sales data for the selected date range.</p>
      )}
    </div>
  );
};

export default Reports;
