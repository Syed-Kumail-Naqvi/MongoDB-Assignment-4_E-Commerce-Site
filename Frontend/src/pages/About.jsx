import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
        <p className="text-lg leading-relaxed text-center max-w-3xl mx-auto">
          Welcome to our E-Commerce platform! We are passionate about bringing you the best quality products with a seamless online shopping experience.
          Our mission is to provide a wide range of fashion-forward, reliable, and affordable items to customers all around the world.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mt-16">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Our Story</h2>
            <p className="text-base leading-relaxed">
              Founded by a team of tech enthusiasts and fashion lovers, we wanted to create a place where people could find everything they need in one spot.
              From the beginning, our focus has been on customer satisfaction and innovation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Why Choose Us?</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Wide range of high-quality products</li>
              <li>Secure and fast checkout process</li>
              <li>Excellent customer service</li>
              <li>Affordable prices and regular discounts</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;