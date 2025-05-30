import React, { useEffect, useState } from 'react';
import API from '../api';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', stock: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/products/');
      setProducts(res.data);
    } catch (error) {
      console.error("❌ Fetch error:", error);
      alert("❌ Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: form.name.trim(),
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      };

      if (!data.name || isNaN(data.price) || isNaN(data.stock)) {
        alert("⚠️ Please enter valid data.");
        return;
      }

      if (editingId) {
        await API.put(`/products/${editingId}/`, data);
        alert("✅ Product updated");
      } else {
        await API.post('/products/', data);
        alert("✅ Product added");
      }

      setForm({ name: '', price: '', stock: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error("❌ Submission error:", err.response?.data || err.message || err);
      alert("❌ Failed to save product. Please check your input.");
    }
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, price: product.price, stock: product.stock });
    setEditingId(product.id);
    console.log("Editing product:", product);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}/`);
      alert("🗑️ Product deleted");
      fetchProducts();
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("❌ Failed to delete product.");
    }
  };

  const handleCancel = () => {
    setForm({ name: '', price: '', stock: '' });
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-2xl transition-all duration-300">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 tracking-wide">
        {editingId ? "Edit Product" : "Add New Product"}
      </h2>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-4 gap-4 mb-8">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all"
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-4 text-gray-700">Product List</h3>

      {loading ? (
        <p className="text-gray-500 text-center">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center">No products found.</p>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center border p-3 rounded-xl bg-gray-50 hover:bg-gray-100 shadow-sm animate-fade-in-up"
            >
              <div>
                <span className="font-medium text-gray-800">{p.name}</span>{' '}
                <span className="text-sm text-gray-600">– ₹{p.price.toFixed(2)} (Stock: {p.stock})</span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductPage;
