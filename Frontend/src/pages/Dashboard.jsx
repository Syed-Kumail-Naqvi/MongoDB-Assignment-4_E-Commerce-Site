import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Dashboard = () => {
  const [usersWithOrders, setUsersWithOrders] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
        Swal.fire("Error", data.message || "Invalid product data", "error");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      Swal.fire("Error", "Server error while fetching products", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersWithOrders = async () => {
    try {
      setUserLoading(true);
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setUsersWithOrders(data);
      } else {
        setUsersWithOrders([]);
        Swal.fire("Error", data.message || "Invalid user data", "error");
      }
    } catch (err) {
      console.error("User Fetch Error:", err);
      Swal.fire("Error", "Server error while fetching users", "error");
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUsersWithOrders();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const { name, price, category, image } = newProduct;

    if (!name || !price || !category || !image) {
      Swal.fire("Warning", "Please fill all required fields", "warning");
      return;
    }

    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, val]) => {
      formData.append(key, val);
    });

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
        setProducts([data, ...products]);
      } else {
        Swal.fire("Error", data.message || "Failed to add product", "error");
      }
    } catch (error) {
      console.error("Add Product Error:", error);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

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
          Swal.fire("Error", data.message || "Failed to delete", "error");
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
          <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            {userLoading ? (
              <p className="p-4 text-gray-500">Loading users...</p>
            ) : usersWithOrders.length === 0 ? (
              <p className="p-4 text-gray-500">No users found.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-700">#</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Role</th>
                    <th className="px-6 py-3 font-semibold text-gray-700">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usersWithOrders.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-blue-600">{user.email}</td>
                      <td className="px-6 py-4 capitalize">{user.role || "user"}</td>
                      <td className="px-6 py-4">{user.orders?.length || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Product Dashboard */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Product Dashboard</h2>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
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
                          onClick={() =>
                            Swal.fire("Info", "Edit functionality coming soon!", "info")
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          onClick={() => handleDelete(product._id)}
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
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Product</h2>
            <form onSubmit={(e) => handleAddProduct(e)}>
              <input
                type="text"
                placeholder="Name"
                className="w-full mb-2 p-2 border rounded"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                className="w-full mb-2 p-2 border rounded"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
              ></textarea>
              <input
                type="number"
                placeholder="Price"
                className="w-full mb-2 p-2 border rounded"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Category"
                className="w-full mb-2 p-2 border rounded"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              />
              <input
                type="file"
                accept="image/*"
                className="w-full mb-4"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image: e.target.files[0] })
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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