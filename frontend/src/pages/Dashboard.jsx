// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageWrapper from "../components/pageWrapper";
import api from "../api";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [selectedView, setSelectedView] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const productRes = await api.get("/products");
        setProducts(productRes.data);

        const salesRes = await api.get("/sales");
        setSales(salesRes.data);

        const topRes = await api.get("/top-products?limit=3");
        setTopProducts(topRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-60">
          <span className="text-gray-500 text-lg">Loading Dashboard...</span>
        </div>
      </PageWrapper>
    );
  }

  const totalSalesToday = sales
    .filter((sale) => new Date(sale.date).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + curr.total_price, 0);

  const lowStock = products.filter((p) => p.stock <= 5);

  // Animation variants for smooth fade + slide
  const animationVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-yellow-700">📊 Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => setSelectedView("products")}
            className="bg-yellow-100 p-4 rounded-xl shadow cursor-pointer hover:bg-yellow-200 transform transition-transform duration-200 hover:scale-105"
          >
            <h2 className="text-lg font-semibold text-yellow-900">Total Products</h2>
            <p className="text-3xl font-bold">{products.length}</p>
          </div>

          <div
            onClick={() => setSelectedView("sales")}
            className="bg-green-100 p-4 rounded-xl shadow cursor-pointer hover:bg-green-200 transform transition-transform duration-200 hover:scale-105"
          >
            <h2 className="text-lg font-semibold text-green-900">Sales Today</h2>
            <p className="text-3xl font-bold">₹{totalSalesToday.toFixed(2)}</p>
          </div>

          <div
            onClick={() => setSelectedView("lowStock")}
            className="bg-blue-100 p-4 rounded-xl shadow cursor-pointer hover:bg-blue-200 transform transition-transform duration-200 hover:scale-105"
          >
            <h2 className="text-lg font-semibold text-blue-900">Low Stock Items</h2>
            <p className="text-3xl font-bold">{lowStock.length}</p>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">🔥 Top Selling Products</h2>
          <ul className="space-y-2">
            {topProducts.map((p, idx) => (
              <li
                key={p.id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <span>
                  {idx + 1}. {p.name}
                </span>
                <span className="text-sm text-gray-600">Sold: {p.total_sold}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Low Stock Alerts */}
        {lowStock.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4 text-red-800">⚠️ Low Stock Alerts</h2>
            <ul className="space-y-2">
              {lowStock.map((p) => (
                <li
                  key={p.id}
                  className="bg-red-100 p-3 rounded shadow flex justify-between"
                >
                  <span>{p.name}</span>
                  <span className="text-red-600 font-bold">Only {p.stock} left</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Animated Detail Views */}
        <AnimatePresence mode="wait">
          {selectedView === "products" && (
            <motion.div
              key="products"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={animationVariants}
              transition={{ duration: 0.3 }}
              className="mt-10"
            >
              <h2 className="text-xl font-semibold mb-4 text-yellow-800">📦 All Products</h2>
              <ul className="space-y-2">
                {products.map((p) => (
                  <li
                    key={p.id}
                    className="bg-white p-4 rounded shadow flex justify-between"
                  >
                    <span>{p.name}</span>
                    <span className="text-gray-600">Stock: {p.stock}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {selectedView === "sales" && (
            <motion.div
              key="sales"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={animationVariants}
              transition={{ duration: 0.3 }}
              className="mt-10"
            >
              <h2 className="text-xl font-semibold mb-4 text-green-800">💰 Today's Sales</h2>
              <ul className="space-y-2">
                {sales
                  .filter(
                    (sale) =>
                      new Date(sale.date).toDateString() === new Date().toDateString()
                  )
                  .map((sale) => (
                    <li
                      key={sale.id}
                      className="bg-white p-4 rounded shadow flex justify-between"
                    >
                      <span>{sale.product_name}</span>
                      <span className="text-gray-600">₹{sale.total_price}</span>
                    </li>
                  ))}
              </ul>
            </motion.div>
          )}

          {selectedView === "lowStock" && (
            <motion.div
              key="lowStock"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={animationVariants}
              transition={{ duration: 0.3 }}
              className="mt-10"
            >
              <h2 className="text-xl font-semibold mb-4 text-red-800">🔻 Low Stock Items</h2>
              <ul className="space-y-2">
                {lowStock.map((p) => (
                  <li
                    key={p.id}
                    className="bg-white p-4 rounded shadow flex justify-between"
                  >
                    <span>{p.name}</span>
                    <span className="text-red-600 font-bold">{p.stock} left</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Button */}
        {selectedView && (
          <div className="mt-6">
            <button
              onClick={() => setSelectedView(null)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
            >
              🔙 Back to Summary
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
