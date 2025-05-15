import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  // Remove item from cart with SweetAlert confirmation
  const handleRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setCartItems(cartItems.filter((item) => item.id !== id));
        Swal.fire("Removed!", "The item has been removed.", "success");
      }
    });
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-4">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">
              Looks like you haven’t added anything yet.
            </p>
            <Link
              to="/shop"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              onClick={() =>
                Swal.fire({
                  icon: "info",
                  title: "Keep Shopping!",
                  text: "Add items to your cart to see them here.",
                })
              }
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded shadow p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">
                    ${item.price * item.quantity}
                  </p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="mt-2 text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="text-right text-xl font-bold text-gray-800">
              Total: ${totalPrice}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CartPage;