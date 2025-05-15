import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const ProductPage = () => {
  const [products, setProducts] = useState([]); 

  return (
    <div className="bg-gray-900 min-h-screen text-white py-10 px-6">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">All Products</h2>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="mb-4 text-xl">No products available right now.</p>
            <Link
              to="/dashboard"
              className="bg-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Head to Dashboard to Add Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
                <p className="text-gray-400 mb-3">{product.description}</p>
                <span className="text-blue-500 font-bold text-lg">{product.price}</span>
                <Link
                  to={`/product/${product.id}`}
                  className="block mt-4 bg-blue-600 text-white py-2 rounded-md text-center font-semibold hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;