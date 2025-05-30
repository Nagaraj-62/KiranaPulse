import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaChartLine, FaPlus, FaReceipt } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const linkStyle = (path) =>
    `block px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
      location.pathname === path
        ? "bg-yellow-500 text-white"
        : "text-yellow-800 hover:bg-yellow-100"
    }`;

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-yellow-700">🛍️ Grocery Tracker</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <Link to="/" className={linkStyle("/")}> <FaChartLine className="inline mr-1" /> Dashboard </Link>
          <Link to="/products" className={linkStyle("/products")}> <FaPlus className="inline mr-1" /> Add Products </Link>
          <Link to="/sales" className={linkStyle("/sales")}> <FaReceipt className="inline mr-1" /> Sales Entry </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-yellow-700 text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 flex flex-col space-y-2">
          <Link to="/" className={linkStyle("/" )} onClick={() => setIsOpen(false)}> <FaChartLine className="inline mr-1" /> Dashboard </Link>
          <Link to="/add-product" className={linkStyle("/add-product")} onClick={() => setIsOpen(false)}> <FaPlus className="inline mr-1" /> Add Products </Link>
          <Link to="/sales" className={linkStyle("/sales")} onClick={() => setIsOpen(false)}> <FaReceipt className="inline mr-1" /> Sales Entry </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
