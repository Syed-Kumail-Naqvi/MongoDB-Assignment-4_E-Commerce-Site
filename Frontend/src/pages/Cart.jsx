import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Swal from "sweetalert2";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useCart } from '../Context/useCartHook';
import { useAuth } from '../Context/useAuthHook';

const CartPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getTotalPrice,
    clearCart
  } = useCart();
  const { user, token } = useAuth(); // Get user and token from AuthContext

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("PayPal"); // Default payment method

  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCheckout = async () => {
    if (!user) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please log in to proceed with your order.',
        confirmButtonText: 'Go to Login',
        showCancelButton: true,
        cancelButtonText: 'Stay Here'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login'); // Redirect to login page
        }
      });
      return;
    }

    if (cartItems.length === 0) {
      Swal.fire('Empty Cart', 'Your cart is empty. Please add items before checking out.', 'warning');
      return;
    }

    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      Swal.fire('Missing Information', 'Please fill in all shipping address details.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Proceed to Checkout?',
      text: "You are about to place your order.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Place Order',
      cancelButtonText: 'Not now',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const orderData = {
          products: cartItems.map(item => ({
            product: item._id, // Assuming _id is the product ID
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image // Include image for frontend display in order history
          })),
          shippingAddress,
          paymentMethod,
          totalAmount: getTotalPrice(),
        };

        try {
          const res = await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Send the user's token
            },
            body: JSON.stringify(orderData),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to place order: ${res.status}`);
          }

          const data = await res.json();
          return data; // Return the order data to the .then block
        } catch (error) {
          Swal.showValidationMessage(`Order failed: ${error.message}`);
          return false; // Prevent further execution if error occurs
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire(
          'Order Placed!',
          `Your order has been placed successfully! Order ID: ${result.value._id}`,
          'success'
        );
        clearCart(); // Clear the cart after successful order
        navigate('/products'); // Or navigate to an order confirmation page
      } else if (result.isDismissed && Swal.getDenyButton) { // If user clicks 'Not now' or dismisses
          // User chose to cancel or closed the modal
          console.log("Order placement cancelled.");
      }
    });
  };

  return (
    // Main container background will now respond to dark mode
    <div className="min-h-screen bg-gray-100 flex flex-col
                    dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-16 flex-grow">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center
                       dark:text-white">Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-xl p-8
                          dark:bg-gray-800 dark:shadow-2xl"> {/* Dark mode styles */}
            <h3 className="text-2xl font-semibold mb-4 text-gray-800
                           dark:text-gray-100">Your cart is empty</h3> {/* Dark mode text */}
            <p className="text-gray-600 mb-6
                          dark:text-gray-300">
              Looks like you haven’t added anything yet. Go ahead and explore our amazing products!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="lg:w-2/3 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center justify-between transition-transform duration-200 hover:scale-[1.01]
                             dark:bg-gray-800 dark:shadow-xl dark:border dark:border-gray-700 dark:hover:bg-gray-700" /* Dark mode styles */
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg shadow-md flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{item.name}</h3> {/* Dark mode text */}
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2 dark:text-gray-300">{item.description}</p> {/* Dark mode text */}
                      <p className="text-lg font-semibold text-blue-600 mt-2 dark:text-blue-300"> {/* Dark mode text */}
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:ml-auto">
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1
                                   dark:bg-gray-700 dark:border dark:border-gray-600"> {/* Dark mode styles */}
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50
                                   dark:text-gray-200 dark:hover:bg-gray-600" /* Dark mode styles */
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="font-semibold text-gray-800 min-w-[20px] text-center dark:text-gray-100">{item.quantity}</span> {/* Dark mode text */}
                      <button
                        onClick={() => increaseQuantity(item._id)}
                        className="text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors
                                   dark:text-gray-200 dark:hover:bg-gray-600" /* Dark mode styles */
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xl font-bold text-green-600 w-24 text-right dark:text-green-400"> {/* Dark mode text */}
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 ml-4 p-2 rounded-full hover:bg-red-100
                                 dark:hover:bg-gray-700 dark:text-red-400 dark:hover:text-red-500" /* Dark mode styles */
                      title="Remove Item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Checkout Form */}
            <div className="lg:w-1/3 bg-white rounded-xl shadow-lg p-6 h-fit sticky top-28
                            dark:bg-gray-800 dark:shadow-2xl dark:border dark:border-gray-700"> {/* Dark mode styles */}
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4
                             dark:text-white dark:border-gray-700">Order Summary</h3> {/* Dark mode styles */}
              <div className="flex justify-between items-center text-lg mb-3">
                <span className="text-gray-700 dark:text-gray-300">Subtotal ({cartItems.length} items):</span> {/* Dark mode text */}
                <span className="font-semibold text-gray-800 dark:text-gray-100">${getTotalPrice().toFixed(2)}</span> {/* Dark mode text */}
              </div>
              <div className="flex justify-between items-center text-lg mb-3 border-b pb-3 dark:border-gray-700"> {/* Dark mode border */}
                <span className="text-gray-700 dark:text-gray-300">Shipping:</span> {/* Dark mode text */}
                <span className="font-semibold text-gray-800 dark:text-gray-100">Free</span> {/* Dark mode text */}
              </div>
              <div className="flex justify-between items-center text-2xl font-extrabold mt-6">
                <span className="text-gray-900 dark:text-white">Total:</span> {/* Dark mode text */}
                <span className="text-blue-600 dark:text-blue-400">${getTotalPrice().toFixed(2)}</span> {/* Dark mode text */}
              </div>

              {/* Shipping Address Form */}
              <div className="mt-8 pt-4 border-t dark:border-gray-700"> {/* Dark mode border */}
                <h4 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">Shipping Information</h4> {/* Dark mode text */}
                <div className="space-y-3">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Address</label> {/* Dark mode text */}
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleShippingAddressChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500
                                 dark:bg-gray-700 dark:border-gray-600 dark:text-white" /* Dark mode styles */
                      placeholder="Street address, apartment, etc."
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-200">City</label> {/* Dark mode text */}
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleShippingAddressChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500
                                 dark:bg-gray-700 dark:border-gray-600 dark:text-white" /* Dark mode styles */
                      placeholder="e.g., Karachi"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Postal Code</label> {/* Dark mode text */}
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleShippingAddressChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500
                                   dark:bg-gray-700 dark:border-gray-600 dark:text-white" /* Dark mode styles */
                        placeholder="e.g., 75000"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Country</label> {/* Dark mode text */}
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleShippingAddressChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500
                                   dark:bg-gray-700 dark:border-gray-600 dark:text-white" /* Dark mode styles */
                        placeholder="e.g., Pakistan"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="mt-8 pt-4 border-t dark:border-gray-700"> {/* Dark mode border */}
                <h4 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">Payment Method</h4> {/* Dark mode text */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="PayPal"
                      checked={paymentMethod === "PayPal"}
                      onChange={handlePaymentMethodChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300
                                 dark:focus:ring-blue-400 dark:text-blue-400 dark:border-gray-600 dark:bg-gray-700" /* Dark mode styles */
                    />
                    <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200">
                      PayPal
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="stripe"
                      name="paymentMethod"
                      value="Stripe"
                      checked={paymentMethod === "Stripe"}
                      onChange={handlePaymentMethodChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300
                                 dark:focus:ring-blue-400 dark:text-blue-400 dark:border-gray-600 dark:bg-gray-700" /* Dark mode styles */
                    />
                    <label htmlFor="stripe" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Stripe
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cashOnDelivery"
                      name="paymentMethod"
                      value="Cash On Delivery"
                      checked={paymentMethod === "Cash On Delivery"}
                      onChange={handlePaymentMethodChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300
                                 dark:focus:ring-blue-400 dark:text-blue-400 dark:border-gray-600 dark:bg-gray-700" /* Dark mode styles */
                    />
                    <label htmlFor="cashOnDelivery" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Cash On Delivery (COD)
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-3 mt-8 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors shadow-md transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full bg-red-500 text-white py-2 mt-4 rounded-full text-md font-semibold hover:bg-red-600 transition-colors opacity-80"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;