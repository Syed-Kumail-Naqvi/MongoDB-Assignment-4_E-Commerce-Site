import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import '../index.css'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Discover the Latest Trends
          </h2>
          <p className="text-gray-600 mb-6">
            Shop the newest collections in fashion, electronics, and more.
          </p>
          <Link
            to="/product"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Shop Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block bg-white p-4 rounded shadow">
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/shop" className="hover:text-blue-600">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop/fashion" className="hover:text-blue-600">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/shop/electronics" className="hover:text-blue-600">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/shop/home-kitchen" className="hover:text-blue-600">
                  Home & Kitchen
                </Link>
              </li>
            </ul>
            <h4 className="text-lg font-semibold mt-6 mb-2">Price Range</h4>
            <input type="range" className="w-full" min="0" max="500" />
          </aside>

          {/* Product Listing */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Shop All</h3>
              <select className="border border-gray-300 rounded px-3 py-1">
                <option>Sort by</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white shadow rounded p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <h4 className="text-lg font-medium">Product Name</h4>
                  <p className="text-sm text-gray-500 mb-2">Category</p>
                  <span className="text-blue-600 font-semibold">$99.99</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
