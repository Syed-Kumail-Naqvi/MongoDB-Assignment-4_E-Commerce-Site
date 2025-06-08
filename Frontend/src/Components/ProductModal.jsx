import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

// ProductModal component handles adding and editing products
const ProductModal = ({ product, onClose, token, onProductSuccess }) => {
  // State to manage the form data for a new or existing product
  const [formData, setFormData] = useState({
    name: product ? product.name : '',
    description: product ? product.description : '',
    price: product ? product.price : '',
    category: product ? product.category : '',
  });
  // State to hold the selected image file
  const [imageFile, setImageFile] = useState(null);
  // Loading state specific to the modal's operations (add/update)
  const [modalLoading, setModalLoading] = useState(false);

  // Effect to update form data when a different product is passed for editing,
  // or when opening for a new product (product prop becomes null).
  useEffect(() => {
    if (product) {
      // If product exists (editing mode), populate form fields with product data
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
      });
      setImageFile(null); // Clear image input when editing, user can re-select if needed
    } else {
      // If no product (adding mode), reset form fields
      setFormData({ name: '', description: '', price: '', category: '' });
      setImageFile(null); // Ensure image file is cleared
    }
  }, [product]); // Dependency array: re-run when 'product' prop changes

  // Handles changes in text input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handles changes in the file input field (for image upload)
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Handles form submission for both adding and updating products
  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true); // Start loading state

    // Basic validation
    const { name, description, price, category } = formData;
    if (!name || !description || !price || !category) {
      Swal.fire("Warning", "Please fill all required fields.", "warning");
      setModalLoading(false);
      return;
    }
    if (!product && !imageFile) { // Only require image if adding a new product
      Swal.fire("Warning", "Please select an image for the new product.", "warning");
      setModalLoading(false);
      return;
    }

    // Create FormData object to send multipart/form-data, necessary for file uploads
    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }
    if (imageFile) {
      payload.append('image', imageFile); // Append the selected image file
    }

    try {
      // Determine API URL and HTTP method based on whether it's an edit or add operation
      const url = product
        ? `http://localhost:5000/api/products/${product._id}` // URL for updating existing product
        : 'http://localhost:5000/api/products'; // URL for adding new product
      const method = product ? 'PUT' : 'POST'; // PUT for update, POST for add

      // Send the fetch request
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`, // Use the token for authentication
        },
        body: payload, // Send FormData as body
      });

      const data = await res.json(); // Parse the JSON response

      if (res.ok) {
        // Show success message
        Swal.fire('Success', product ? 'Product updated successfully!' : 'Product added successfully!', 'success');
        onClose(); // Close the modal
        onProductSuccess(); // Trigger product list refresh in parent Dashboard component
      } else {
        // Show error message from server
        Swal.fire('Error', data.message || 'Failed to save product.', 'error');
      }
    } catch (err) {
      // Handle network or unexpected errors
      Swal.fire('Error', 'Network error or server unavailable.', 'error');
      console.error("Product save error:", err);
    } finally {
      setModalLoading(false); // End loading state
    }
  };

  return (
    // Modal overlay and container with Tailwind CSS for styling
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl dark:bg-gray-800 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {product ? 'Edit Product' : 'Add New Product'} {/* Dynamic title */}
          </h2>
          <button
            type="button"
            onClick={onClose} // Button to close the modal
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-3xl font-bold"
          >
            &times; {/* Close icon */}
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required
              className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
          </div>
          {/* Product Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} required rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-y"></textarea>
          </div>
          {/* Price and Category Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Price</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleInputChange} required
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Category</label>
              <input type="text" name="category" id="category" value={formData.category} onChange={handleInputChange} required
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
            </div>
          </div>
          {/* Image Upload Input */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">Image</label>
            <input type="file" name="image" id="image" onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:file:bg-blue-800 dark:file:text-blue-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" />
            {product?.image && !imageFile && (
              <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">Current image: <a href={product.image} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a></p>
            )}
          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button type="button" onClick={onClose}
              className="bg-gray-300 text-gray-800 px-5 py-2 rounded-full hover:bg-gray-400 font-semibold shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
              Cancel
            </button>
            <button type="submit" disabled={modalLoading}
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
              {modalLoading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;