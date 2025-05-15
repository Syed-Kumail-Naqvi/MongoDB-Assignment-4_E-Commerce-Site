import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all products on mount or after updates
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      } else {
        Swal.fire("Error", data.message || "Failed to fetch products", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error fetching products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.category ||
      !newProduct.image
    ) {
      Swal.fire("Warning", "Please fill all required fields", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("category", newProduct.category);
    formData.append("image", newProduct.image);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", "Product added successfully!", "success");
        setShowModal(false);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          category: "",
          image: null,
        });
        fetchProducts(); // refresh list
      } else {
        Swal.fire("Error", data.message || "Failed to add product", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong while adding product", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Simple delete function placeholder
  const handleDelete = async (productId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/products/${productId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          Swal.fire("Deleted!", "Product has been deleted.", "success");
          fetchProducts();
        } else {
          Swal.fire("Error", data.message || "Failed to delete product", "error");
        }
      } catch (error) {
        Swal.fire("Error", "Server error deleting product", "error");
      } finally {
        setLoading(false);
      }
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
            {/* TODO: Fetch and display user data */}
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
              disabled={loading}
            >
              Add Product
            </button>
          </div>
          <div className="bg-white shadow rounded-xl p-4">
            {loading ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p>No Products Found.</p>
            ) : (
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Category</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{product.name}</td>
                      <td className="border px-4 py-2">${product.price}</td>
                      <td className="border px-4 py-2">{product.category}</td>
                      <td className="border px-4 py-2 space-x-2">
                        <button
                          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                          // TODO: Implement edit modal & logic
                          onClick={() =>
                            Swal.fire(
                              "Info",
                              "Edit feature coming soon!",
                              "info"
                            )
                          }
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          onClick={() => handleDelete(product._id)}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
            <form onSubmit={handleAddProduct} encType="multipart/form-data">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border px-3 py-2 rounded"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  required
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.files[0] })
                  }
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Product"}
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