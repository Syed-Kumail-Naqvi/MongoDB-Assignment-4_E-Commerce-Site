import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Swal from "sweetalert2";
import { FaShoppingCart } from 'react-icons/fa';

import { useCart } from '../Context/useCartHook';
import { useAuth } from '../Context/useAuthHook';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { user } = useAuth(); // Get the logged-in user from AuthContext

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/products");

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          throw new Error(data.message || "Failed to fetch products or invalid data format.");
        }
      } catch (err) {
        console.error("Fetch Products Error:", err);
        setError("Failed to load products. Please try again later.");
        Swal.fire("Error", err.message || "Failed to load products.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!user) { // Check if user is logged in
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please log in to add products to your cart.",
        confirmButtonText: "Go to Login",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login"; // Redirect to login page
        }
      });
      return; // Stop the function here if not logged in
    }
    // If logged in, proceed to add to cart
    addToCart(product);
    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `${product.name} has been added to your cart.`,
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    // Main container background will now respond to dark mode
    <div className="bg-gray-100 min-h-screen text-gray-900 flex flex-col
                    dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-grow">
        <h2 className="text-3xl font-semibold mb-8 text-blue-600
                       dark:text-blue-400">All Products</h2>

        {/* Loading state */}
        {loading && (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading products...</p>
        )}

        {/* Error state (for network/fetch issues) */}
        {error && (
          <p className="text-center text-red-500 dark:text-red-400">{error}</p>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition cursor-pointer flex flex-col
                             dark:bg-gray-800 dark:shadow-xl dark:border dark:border-gray-700"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4 flex-shrink-0"
                  />
                  <h3 className="text-lg font-semibold mb-1 text-gray-900 flex-grow
                                 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-2 line-clamp-3 dark:text-gray-400">{product.description}</p>
                  <p className="font-semibold text-blue-700 mb-4 dark:text-blue-300">${product.price.toFixed(2)}</p>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 mt-auto"
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-600 dark:text-gray-400">
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