import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../index.css';

const ProductPage = () => {
  // Example static product data
  const [products, setProducts] = useState([

    {
      id: 1,
      name: "Product 1",
      description: "This is a description for Product 1",
      price: "$99.99",
      image: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      name: "Product 2",
      description: "This is a description for Product 2",
      price: "$49.99",
      image: "https://via.placeholder.com/300",
    },
    
  ]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-6">All Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow rounded p-4 hover:shadow-lg transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h4 className="text-lg font-medium">{product.name}</h4>
              <p className="text-sm text-gray-500 mb-2">{product.description}</p>
              <span className="text-blue-600 font-semibold">{product.price}</span>
              <Link
                to={`/product/${product.id}`}
                className="block mt-4 bg-blue-600 text-white px-4 py-2 rounded text-center"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
