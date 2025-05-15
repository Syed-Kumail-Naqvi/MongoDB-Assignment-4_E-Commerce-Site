import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "../index.css";

const staticProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "Classic Sneakers",
    category: "Fashion",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1528701800489-802460c06e72?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "Smart Watch",
    category: "Electronics",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1519741494425-1d8d7c68f8f3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "Coffee Maker",
    category: "Home & Kitchen",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "Denim Jacket",
    category: "Fashion",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1508898578281-774ac4893a54?auto=format&fit=crop&w=600&q=80",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Discover the Latest Trends
          </h2>
          <p className="text-gray-700 mb-6">
            Shop the newest collections in fashion, electronics, and more.
          </p>
          <Link
            to="/product"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-semibold mb-8 text-center text-gray-900">
            Featured Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {staticProducts.map(({ id, name, category, price, image }) => (
              <div
                key={id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-default"
                title="Static product — not orderable"
              >
                <img
                  src={image}
                  alt={name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-medium mb-1 text-gray-900">
                    {name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">{category}</p>
                  <span className="text-blue-600 font-semibold">
                    ${price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
