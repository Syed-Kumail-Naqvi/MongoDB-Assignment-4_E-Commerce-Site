import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom"; // Import Link for internal navigation

const AboutPage = () => {
  return (
    // Main container background and text color will now respond to dark mode
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col
                    dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow"> {/* Flex-grow ensures main content pushes footer down */}
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4 text-center overflow-hidden">
          {/* Background shapes for visual interest */}
          <div className="absolute inset-0 z-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="#ffffff" fillOpacity="0.1" d="M0,160L48,176C96,192,192,224,288,208C384,192,480,128,576,96C672,64,768,64,864,80C960,96,1056,128,1152,128C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
            </svg>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-down">
              About E-Store: Your Ultimate Shopping Destination
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed opacity-90 animate-fade-in-up">
              We're dedicated to bringing you the best products and an unparalleled online shopping experience.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 px-4 bg-white
                            dark:bg-gray-800 transition-colors duration-300">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-gray-900
                           dark:text-blue-400">Our Mission</h2>
            <p className="text-lg leading-relaxed max-w-3xl mx-auto text-gray-700
                          dark:text-gray-300">
              At E-Store, our mission is to empower individuals to express their unique style and needs by providing a diverse collection of high-quality, reliable, and trend-setting products. We are committed to fostering a seamless, secure, and enjoyable shopping journey for every customer, everywhere.
            </p>
          </div>
        </section>

        {/* Our Story & Values */}
        <section className="py-16 px-4 bg-gray-50
                            dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-4 text-gray-900
                             dark:text-white">The E-Store Journey</h2>
              <p className="text-lg leading-relaxed text-gray-700 mb-6
                            dark:text-gray-300">
                Born from a shared passion for technology and consumer goods, E-Store was founded by a team of visionary enthusiasts who believed online shopping could be more than just a transaction. We envisioned a platform that connects people with exceptional products, built on principles of trust, innovation, and customer-centricity. From our humble beginnings, we've grown into a thriving community, always prioritizing your satisfaction.
              </p>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800
                             dark:text-blue-200">Core Values:</h3>
              <ul className="list-disc list-inside space-y-2 text-lg text-gray-700
                             dark:text-gray-300">
                <li><span className="font-semibold text-blue-600 dark:text-blue-400">Quality:</span> We handpick every item to ensure it meets our high standards.</li>
                <li><span className="font-semibold text-blue-600 dark:text-blue-400">Innovation:</span> Constantly exploring new trends and technologies.</li>
                <li><span className="font-semibold text-blue-600 dark:text-blue-400">Customer Focus:</span> Your happiness is at the heart of everything we do.</li>
                <li><span className="font-semibold text-blue-600 dark:text-blue-400">Integrity:</span> Transparent and honest in all our dealings.</li>
              </ul>
            </div>
            <div className="order-1 md:order-2">
              {/* This is the updated image tag to ensure it renders */}
              <img
                src="https://via.placeholder.com/600x400/3B82F6/ffffff?text=Our+Awesome+Team"
                alt="Our Team Working Hard"
                className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-500 ease-in-out w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Why Choose Us - Features Section */}
        <section className="py-16 px-4 bg-white
                            dark:bg-gray-800 transition-colors duration-300">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 text-gray-900
                           dark:text-blue-400">Why E-Store is Your Best Choice</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1
                              dark:bg-gray-700 dark:shadow-lg dark:border dark:border-gray-600">
                <div className="text-blue-600 mb-4 text-4xl dark:text-blue-300">🛍️</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Vast Selection</h3>
                <p className="text-gray-600 dark:text-gray-400">Explore an extensive catalog of products, from everyday essentials to unique finds.</p>
              </div>
              {/* Feature 2 */}
              <div className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1
                              dark:bg-gray-700 dark:shadow-lg dark:border dark:border-gray-600">
                <div className="text-green-600 mb-4 text-4xl dark:text-green-300">🔒</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Secure Shopping</h3>
                <p className="text-gray-600 dark:text-gray-400">Shop with confidence, knowing your data and transactions are protected.</p>
              </div>
              {/* Feature 3 */}
              <div className="bg-yellow-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1
                              dark:bg-gray-700 dark:shadow-lg dark:border dark:border-gray-600">
                <div className="text-yellow-600 mb-4 text-4xl dark:text-yellow-300">💬</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Dedicated Support</h3>
                <p className="text-gray-600 dark:text-gray-400">Our friendly customer service team is always ready to assist you.</p>
              </div>
              {/* Feature 4 */}
              <div className="bg-purple-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1
                              dark:bg-gray-700 dark:shadow-lg dark:border dark:border-gray-600">
                <div className="text-purple-600 mb-4 text-4xl dark:text-purple-300">💰</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Unbeatable Value</h3>
                <p className="text-gray-600 dark:text-gray-400">Enjoy competitive prices and regular promotions on all your favorites.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 px-4 bg-gray-800 text-white text-center
                            dark:bg-gray-700 transition-colors duration-300">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Shopping?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join the E-Store community today and discover a world of endless possibilities.
            </p>
            <Link
              to="/products"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Explore Our Products
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;