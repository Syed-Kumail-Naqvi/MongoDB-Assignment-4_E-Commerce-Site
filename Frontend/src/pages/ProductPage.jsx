import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products"); // Your backend endpoint
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-grow">
        <h2 className="text-3xl font-semibold mb-8 text-blue-400">All Products</h2>

        {loading && (
          <p className="text-center text-gray-400">Loading products...</p>
        )}

        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <img
                    src={product.imageUrl} // Adjust if your backend sends differently
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-1 text-gray-100">
                    {product.name}
                  </h3>
                  <p className="text-gray-400 mb-2">{product.description}</p>
                  <p className="font-semibold text-blue-400">${product.price}</p>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-400">
                No products available right now.
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;