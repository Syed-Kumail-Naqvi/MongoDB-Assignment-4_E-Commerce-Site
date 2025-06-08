import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../index.css";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          const shuffled = data.products.sort(() => 0.5 - Math.random());
          setFeaturedProducts(shuffled.slice(0, 4));
        } else {
          throw new Error(data.message || "Failed to fetch featured products.");
        }
      } catch (err) {
        console.error("Fetch Featured Products Error:", err);
        setErrorFeatured("Failed to load featured products.");
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    // Main container background will now adapt based on theme
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col
                    dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <Navbar />

      {/* Hero Section - A striking, dark-themed banner (remains fixed for aesthetic) */}
      <section
        className="relative bg-gradient-to-r from-blue-700 to-indigo-900 text-white py-24 md:py-32 overflow-hidden"
        style={{
          // Using a tech-focused image that looks good regardless of overall theme
          backgroundImage: "url('https://images.unsplash.com/photo-1510519138101-570d1dca3d66?auto=format&fit=crop&w=1800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg animate-fade-in-up">
            Power Up Your Life.
            <br />
            Next-Gen Tech, Today.
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-3xl mx-auto drop-shadow animate-fade-in-up delay-200">
            Discover the latest in Mobiles, Laptops, Desktops, and essential Electronic Accessories. Innovation is just a click away.
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-blue-700 px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:bg-gray-100 hover:text-blue-800 transform hover:scale-105 transition-all duration-300 ease-in-out animate-bounce-in delay-400"
          >
            Explore Electronics
          </Link>
        </div>
      </section>

      {/* Categories Section - Adapts to theme */}
      <section className="py-16 bg-white shadow-inner
                          dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold mb-10 text-center text-gray-900
                         dark:text-blue-400">
            Shop by Category
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mobiles & Smartphones Category Card */}
            <div className="bg-blue-100 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300 shadow-md
                            dark:bg-gray-700 dark:border dark:border-gray-600">
              <Link to="/products?category=Mobiles" className="block text-blue-700 font-semibold text-2xl mb-2
                                                               dark:text-blue-300">
                Mobiles & Smartphones
              </Link>
              <p className="text-gray-600 dark:text-gray-400">Latest phones, features, and accessories.</p>
            </div>
            {/* Computers & Laptops Category Card */}
            <div className="bg-green-100 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300 shadow-md
                            dark:bg-gray-700 dark:border dark:border-gray-600">
              <Link to="/products?category=Computers" className="block text-green-700 font-semibold text-2xl mb-2
                                                                dark:text-green-300">
                Computers & Laptops
              </Link>
              <p className="text-gray-600 dark:text-gray-400">Powerful systems for work and play.</p>
            </div>
            {/* Electronic Accessories Category Card */}
            <div className="bg-purple-100 p-6 rounded-xl text-center transform hover:scale-105 transition-transform duration-300 shadow-md
                            dark:bg-gray-700 dark:border dark:border-gray-600">
              <Link to="/products?category=Accessories" className="block text-purple-700 font-semibold text-2xl mb-2
                                                                dark:text-purple-300">
                Electronic Accessories
              </Link>
              <p className="text-gray-600 dark:text-gray-400">Headphones, chargers, wearables & more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section - Adapts to theme */}
      <section className="py-16 bg-gray-50 flex-grow
                          dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center text-gray-900
                         dark:text-blue-400">
            Our Top Picks
          </h3>
          {loadingFeatured && (
            <p className="text-center text-gray-600 dark:text-gray-400">Loading amazing products...</p>
          )}
          {errorFeatured && (
            <p className="text-center text-red-500 dark:text-red-400">{errorFeatured}</p>
          )}
          {!loadingFeatured && !errorFeatured && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer group
                                dark:bg-gray-700 dark:shadow-xl dark:border dark:border-gray-600"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-48 w-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                    />
                    <div className="p-5">
                      <h4 className="text-xl font-bold mb-1 text-gray-900 truncate
                                     dark:text-white">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 capitalize
                                    dark:text-gray-400">
                        {product.category}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-blue-700 font-extrabold text-lg
                                         dark:text-blue-300">
                          ${product.price.toFixed(2)}
                        </span>
                        <Link
                          to={`/products/${product._id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors duration-300"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-full text-gray-600 dark:text-gray-400">
                  No featured products available.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;