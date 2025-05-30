import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SalesEntry = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [sale, setSale] = useState({ product_id: "", quantity: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  // Date range states for report
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Aggregated sales data for chart
  const [chartData, setChartData] = useState([]);

  // Show or hide report section
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [productsRes, salesRes] = await Promise.all([
          api.get("/products"),
          api.get("/sales"),
        ]);

        const products = productsRes.data;
        const salesWithNames = salesRes.data.map((s) => ({
          ...s,
          product_name:
            products.find((p) => p.id === s.product_id)?.name || "Unknown",
        }));

        setProducts(products);
        setSales(salesWithNames);
      } catch (err) {
        console.error(err);
        showAlert("error", "Failed to load data");
      }
    }
    loadInitialData();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSale((prevSale) => ({
      ...prevSale,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sale.product_id || !sale.quantity || sale.quantity <= 0) {
      showAlert("error", "Please select a product and enter a valid quantity.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/sales", {
        product_id: parseInt(sale.product_id),
        quantity: parseInt(sale.quantity),
      });

      showAlert("success", "Sale recorded successfully!");

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === parseInt(sale.product_id)
            ? { ...p, stock: p.stock - parseInt(sale.quantity) }
            : p
        )
      );

      const product = products.find((p) => p.id === parseInt(sale.product_id));
      setSales((prevSales) => [
        {
          id: Date.now(),
          product_id: parseInt(sale.product_id),
          quantity: parseInt(sale.quantity),
          date: new Date().toISOString(),
          product_name: product?.name || "Unknown",
        },
        ...prevSales,
      ]);

      setSale({ product_id: "", quantity: "" });
    } catch (err) {
      console.error(err);
      showAlert("error", "Failed to record sale");
    } finally {
      setLoading(false);
    }
  };

  // Fetch filtered sales and prepare chart data
  const loadReport = () => {
    if (!fromDate || !toDate) {
      showAlert("error", "Please select both From and To dates.");
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      showAlert("error", "'From' date cannot be after 'To' date.");
      return;
    }

    // Filter sales by date range
    const filteredSales = sales.filter((s) => {
      const saleDate = new Date(s.date);
      return saleDate >= new Date(fromDate) && saleDate <= new Date(toDate);
    });

    // Aggregate sales by day
    const aggregate = {};

    filteredSales.forEach((s) => {
      const dateKey = new Date(s.date).toISOString().split("T")[0]; // yyyy-mm-dd
      if (!aggregate[dateKey]) aggregate[dateKey] = 0;
      aggregate[dateKey] += s.quantity;
    });

    // Convert to array sorted by date
    const data = Object.entries(aggregate)
      .map(([date, quantity]) => ({ date, quantity }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setChartData(data);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-yellow-600 flex items-center gap-2">
        📝 Record a Sale
      </h2>

      {/* Alert */}
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

      {/* Sale form */}
      <form onSubmit={handleSubmit} className="mb-10 space-y-5">
        <div>
          <label htmlFor="product_id" className="block font-semibold mb-1">
            Select Product
          </label>
          <select
            id="product_id"
            name="product_id"
            value={sale.product_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            disabled={loading}
          >
            <option value="">-- Choose a product --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.stock <= 5 ? `(Low stock: ${p.stock})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block font-semibold mb-1">
            Quantity Sold
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            placeholder="Enter quantity"
            value={sale.quantity}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-bold rounded-md text-white ${
            loading
              ? "bg-yellow-300 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 transition"
          } flex justify-center items-center gap-3`}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
          Submit Sale
        </button>
      </form>

      {/* Sales History header with Report Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-yellow-700 flex items-center gap-2">
          📊 Sales History
        </h3>
        <button
          onClick={() => navigate("/reports")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition"
          aria-expanded={showReport}
          aria-controls="sales-report-section"
        >
          {showReport ? "Hide Report" : "Show Report"}
        </button>
      </div>

      {sales.length === 0 ? (
        <p className="text-gray-500 mb-10">No sales recorded yet.</p>
      ) : (
        <div className="mb-10 max-h-60 overflow-y-auto border rounded-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-yellow-100 sticky top-0">
              <tr>
                <th className="border p-3 text-yellow-700">Product</th>
                <th className="border p-3 text-yellow-700">Quantity</th>
                <th className="border p-3 text-yellow-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="hover:bg-yellow-50">
                  <td className="border p-3">{s.product_name}</td>
                  <td className="border p-3">{s.quantity}</td>
                  <td className="border p-3">
                    {new Date(s.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesEntry;
