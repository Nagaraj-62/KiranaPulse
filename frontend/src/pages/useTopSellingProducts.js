import { useEffect, useState } from "react";

const useTopSellingProducts = (topN = 5) => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topSellers, setTopSellers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsRes, salesRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/products/"),
          fetch("http://127.0.0.1:8000/sales/")
        ]);

        if (!productsRes.ok || !salesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await productsRes.json();
        const salesData = await salesRes.json();

        setProducts(productsData);
        setSales(salesData);

        const productSalesMap = salesData.reduce((acc, sale) => {
          acc[sale.product_id] = (acc[sale.product_id] || 0) + sale.quantity;
          return acc;
        }, {});

        const productsWithSales = productsData.map(product => ({
          ...product,
          total_sold: productSalesMap[product.id] || 0
        }));

        const sortedTop = productsWithSales
          .sort((a, b) => b.total_sold - a.total_sold)
          .slice(0, topN);

        setTopSellers(sortedTop);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topN]);

  return {
    products,
    sales,
    topSellers,
    loading,
    error
  };
};

export default useTopSellingProducts;
