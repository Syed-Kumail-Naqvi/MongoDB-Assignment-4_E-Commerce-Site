import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("category", newProduct.category);
    formData.append("image", newProduct.image);

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product Added successfully!");
        setShowModal(false);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          category: "",
          image: null,
        });
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("Something went wrong while adding the product.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* User Dashboard */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">User Dashboard</h2>
          <div className="bg-white shadow rounded-xl p-4">
            {/* Replace with dynamic user data */}
            <p>No users found.</p>
          </div>
        </section>

        {/* Product Dashboard */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Product Dashboard</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
              onClick={() => setShowModal(true)}
            >
              Add Product
            </button>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            {/* Replace with dynamic product data */}
            <p>No Products Found.</p>
          </div>
        </section>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  className="w-full"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.files[0] })
                  }
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleAddProduct}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;