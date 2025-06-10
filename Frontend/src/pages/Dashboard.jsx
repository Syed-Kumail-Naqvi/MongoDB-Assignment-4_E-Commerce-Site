import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { FaPlus, FaEdit, FaTrash, FaUsers, FaBoxOpen, FaSpinner } from 'react-icons/fa'; // Added FaSpinner
import { useAuth } from '../Context/useAuthHook';

const Dashboard = () => {
  const [usersWithOrders, setUsersWithOrders] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false); // Renamed to avoid confusion with general 'loading'
  const [totalProducts, setTotalProducts] = useState(0);

  const { user: loggedInUser } = useAuth(); // Get the logged-in user from AuthContext

  // --- Product Fetching ---
  const fetchProducts = async () => {
    try {
      setProductLoading(true);
      const res = await fetch("https://mongodb-assignment-4-e-commerce-site.onrender.com/products");
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.products)) {
        setProducts(data.products);
        setTotalProducts(data.products.length);
      } else {
        setProducts([]);
        setTotalProducts(0);
        Swal.fire(
          "Error",
          data.message || "Failed to fetch products or invalid data format",
          "error"
        );
      }
    } catch (err) {
      console.error("Fetch Products Error:", err);
      setProducts([]);
      setTotalProducts(0);
      Swal.fire("Error", "Server error while fetching products", "error");
    } finally {
      setProductLoading(false);
    }
  };

  // --- User Fetching ---
  const fetchUsersWithOrders = async () => {
    try {
      setUserLoading(true);
      const res = await fetch("https://mongodb-assignment-4-e-commerce-site.onrender.com/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setUsersWithOrders(data);
        setTotalUsers(data.length);
      } else {
        console.error("Failed to fetch users or unexpected data format:", data);
        setUsersWithOrders([]);
        setTotalUsers(0);
        Swal.fire(
          "Error",
          data.message ||
            "Failed to fetch users or unexpected data format from server.",
          "error"
        );
      }
    } catch (err) {
      console.error("User Fetch Error:", err);
      setUsersWithOrders([]);
      setTotalUsers(0);
      Swal.fire("Error", "Server error while fetching users", "error");
    } finally {
      setUserLoading(false);
    }
  };

  // --- Handle Delete User ---
  const handleDeleteUser = async (userId, userName) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete user: ${userName}. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them!",
      confirmButtonColor: "#dc2626", // Red
      cancelButtonColor: "#6b7280" // Gray
    });

    if (confirmed.isConfirmed) {
      try {
        setUserLoading(true); // Indicate loading for user operations
        const res = await fetch(`https://mongodb-assignment-4-e-commerce-site.onrender.com/admin/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        const data = await res.json();

        if (res.ok && data.success) {
          Swal.fire("Deleted!", data.message || "User has been deleted.", "success");
          fetchUsersWithOrders(); // Refresh the user list
        } else {
          Swal.fire("Error", data.message || "Failed to delete user.", "error");
        }
      } catch (error) {
        console.error("Delete User Error:", error);
        Swal.fire(
          "Error",
          "Server error deleting user: " + error.message,
          "error"
        );
      } finally {
        setUserLoading(false);
      }
    }
  };

  // --- Initial Data Load on Component Mount ---
  useEffect(() => {
    fetchProducts();
    fetchUsersWithOrders();
  }, []);

  // --- Handle Product Input Change ---
  const handleProductInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: files ? files[0] : value,
    });
  };

  // --- Open Add Product Modal ---
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
    });
    setShowModal(true);
  };

  // --- Open Edit Product Modal ---
  const openEditModal = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: null, // Image field should be null for edit, unless a new one is selected
    });
    setShowModal(true);
  };

  // --- Add/Update Product Handler ---
  const handleAddUpdateProduct = async (e) => {
    e.preventDefault();

    const { name, description, price, category, image } = newProduct;

    if (!name || !description || !price || !category) {
      Swal.fire("Warning", "Please fill all required fields.", "warning");
      return;
    }

    if (!isEditing && !image) {
        Swal.fire("Warning", "Please select an image for the new product.", "warning");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);
    if (image) { // Only append image if it's new or selected for edit
      formData.append("image", image);
    }

    try {
      setProductLoading(true);
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `https://mongodb-assignment-4-e-commerce-site.onrender.com/products/${currentProduct._id}`
        : "https://mongodb-assignment-4-e-commerce-site.onrender.com/products";

      const res = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          // No 'Content-Type': 'application/json' when sending FormData
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire("Success", `Product ${isEditing ? 'updated' : 'added'} successfully!`, "success");
        setShowModal(false);
        setNewProduct({ name: "", description: "", price: "", category: "", image: null });
        setCurrentProduct(null);
        fetchProducts();
      } else {
        Swal.fire("Error", data.message || `Failed to ${isEditing ? 'update' : 'add'} product`, "error");
      }
    } catch (error) {
      console.error("Product Operation Error:", error);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    } finally {
      setProductLoading(false);
    }
  };

  // --- Delete Product Handler ---
  const handleDelete = async (productId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280"
    });

    if (confirmed.isConfirmed) {
      try {
        setProductLoading(true);
        const res = await fetch(
          `https://mongodb-assignment-4-e-commerce-site.onrender.com/products/${productId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
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
        Swal.fire(
          "Error",
          "Server error deleting product: " + error.message,
          "error"
        );
      } finally {
        setProductLoading(false);
      }
    }
  };

  return (
    // Main container with full height, responsive background, and dark mode transition
    <div className="min-h-screen bg-gray-100 flex flex-col
                    dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="flex-grow py-10 px-4 sm:px-6 lg:px-8"> {/* Added responsive padding */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 sm:mb-10 text-center
                       dark:text-white">
          Admin Dashboard
        </h1>

        {/* --- Numbers Display Section --- */}
        <section className="mb-12 max-w-7xl mx-auto"> {/* Centered and max-width */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"> {/* Responsive grid */}
            {/* Total Users Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 sm:p-8 flex items-center justify-between text-white transform transition-transform duration-300 hover:scale-[1.02]
                            dark:from-blue-700 dark:to-blue-800">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <FaUsers className="text-3xl sm:text-4xl opacity-80" />
                <div>
                  <p className="text-lg sm:text-xl font-medium">Total Users</p>
                  <p className="text-4xl sm:text-5xl font-extrabold mt-1">
                    {userLoading ? (
                      <FaSpinner className="animate-spin inline-block mr-2" />
                    ) : (
                      totalUsers
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Products Card */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-6 sm:p-8 flex items-center justify-between text-white transform transition-transform duration-300 hover:scale-[1.02]
                            dark:from-green-700 dark:to-green-800">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <FaBoxOpen className="text-3xl sm:text-4xl opacity-80" />
                <div>
                  <p className="text-lg sm:text-xl font-medium">Total Products</p>
                  <p className="text-4xl sm:text-5xl font-extrabold mt-1">
                    {productLoading ? (
                      <FaSpinner className="animate-spin inline-block mr-2" />
                    ) : (
                      totalProducts
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- User Management Section --- */}
        <section className="mb-12 bg-white rounded-lg md:rounded-2xl shadow-xl p-6 sm:p-8 max-w-7xl mx-auto
                            dark:bg-gray-800 dark:shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4 sm:mb-0
                           dark:text-blue-400">
              <FaUsers className="text-blue-500 text-2xl sm:text-3xl" /> User Management
            </h2>
          </div>
          <div className="overflow-x-auto min-h-[150px] relative"> {/* Added min-height and relative for loading overlay */}
            {userLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                <FaSpinner className="animate-spin text-blue-500 text-4xl" />
              </div>
            )}
            {usersWithOrders.length === 0 && !userLoading ? (
              <p className="p-6 text-center text-gray-500 text-lg dark:text-gray-400">No users found.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden
                                dark:divide-gray-700 dark:border-gray-700">
                <thead className="bg-blue-600 text-white dark:bg-blue-700">
                  <tr>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Orders</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
                  {usersWithOrders.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150 dark:hover:bg-gray-600">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{index + 1}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name || "N/A"}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-300">{user.email}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm capitalize text-gray-700 dark:text-gray-200">
                        {user.role || "user"}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{user.orders?.length || 0}</td>
                      <td className="px-3 sm:px-6 py-4">
                        <button
                          className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                          onClick={() => handleDeleteUser(user._id, user.name || user.email)}
                          disabled={userLoading || (loggedInUser && loggedInUser._id === user._id)} // Prevent deleting self
                          aria-label={`Delete ${user.name || user.email}`}
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* --- Product Management Section --- */}
        <section className="bg-white rounded-lg md:rounded-2xl shadow-xl p-6 sm:p-8 max-w-7xl mx-auto
                            dark:bg-gray-800 dark:shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4 sm:mb-0
                           dark:text-green-400">
              <FaBoxOpen className="text-green-500 text-2xl sm:text-3xl" /> Product Management
            </h2>
            <button
              className="bg-green-600 text-white px-5 py-2.5 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base font-semibold w-full sm:w-auto justify-center"
              onClick={openAddModal}
              disabled={productLoading}
              aria-label="Add New Product"
            >
              <FaPlus /> Add New Product
            </button>
          </div>

          <div className="overflow-x-auto min-h-[200px] relative"> {/* Added min-height and relative for loading overlay */}
            {productLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 flex items-center justify-center rounded-lg z-10">
                <FaSpinner className="animate-spin text-green-500 text-4xl" />
              </div>
            )}
            {products.length === 0 && !productLoading ? (
              <p className="p-6 text-center text-gray-500 text-lg dark:text-gray-400">No products found.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden
                                dark:divide-gray-700 dark:border-gray-700">
                <thead className="bg-indigo-600 text-white dark:bg-indigo-700">
                  <tr>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-150 dark:hover:bg-gray-600">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded-md shadow-sm"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://i.ibb.co/L84kY2D/product-placeholder.webp' }} // Placeholder image
                        />
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-[150px] truncate">{product.name}</td> {/* Truncate long names */}
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">${product.price.toFixed(2)}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize dark:text-gray-200">{product.category}</td>

                      <td className="px-3 sm:px-6 py-4">
                        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0"> {/* Buttons stack on small screens */}
                          <button
                            className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-200 flex items-center justify-center gap-1 text-sm flex-shrink-0 w-full sm:w-auto"
                            onClick={() => openEditModal(product)}
                            aria-label={`Edit ${product.name}`}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-1 text-sm flex-shrink-0 w-full sm:w-auto"
                            onClick={() => handleDelete(product._id)}
                            aria-label={`Delete ${product.name}`}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {/* --- Product Add/Edit Modal --- */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white p-6 sm:p-8 rounded-lg sm:rounded-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-2xl transform scale-95 animate-scale-in transition-all duration-300 ease-out
                          dark:bg-gray-700">
            <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center
                                          dark:text-white">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleAddUpdateProduct} className="space-y-4">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  name="name"
                  placeholder="e.g., Wireless Headphones"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800
                             dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  value={newProduct.name}
                  onChange={handleProductInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Description</label>
                <textarea
                  id="productDescription"
                  name="description"
                  placeholder="A brief description of the product..."
                  rows="3"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-y text-gray-800
                             dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  value={newProduct.description}
                  onChange={handleProductInputChange}
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Responsive grid for price/category */}
                <div>
                  <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Price ($)</label>
                  <input
                    type="number"
                    id="productPrice"
                    name="price"
                    placeholder="99.99"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800
                               dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    value={newProduct.price}
                    onChange={handleProductInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Category</label>
                  <input
                    type="text"
                    id="productCategory"
                    name="category"
                    placeholder="e.g., Electronics"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800
                               dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                    value={newProduct.category}
                    onChange={handleProductInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="productImage" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Product Image</label>
                <input
                  type="file"
                  id="productImage"
                  name="image"
                  accept="image/*"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 text-gray-800
                             dark:file:bg-blue-800 dark:file:text-white dark:hover:file:bg-blue-700 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  onChange={handleProductInputChange}
                  required={!isEditing}
                />
                  {isEditing && currentProduct?.image && (
                    <p className="text-sm text-gray-500 mt-2 dark:text-gray-300">Current image will be replaced if a new one is selected.</p>
                )}
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4"> {/* Buttons stack on small screens, reverse order */}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-800 px-5 py-2.5 rounded-full hover:bg-gray-400 transition-colors duration-200 font-semibold shadow w-full sm:w-auto
                             dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors duration-200 font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  disabled={productLoading}
                >
                  {productLoading ? <FaSpinner className="animate-spin inline-block mr-2" /> : (isEditing ? "Update Product" : "Add Product")}
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