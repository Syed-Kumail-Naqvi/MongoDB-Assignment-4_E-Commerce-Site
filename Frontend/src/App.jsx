import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/Cart";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import './index.css'
import AboutPage from "./pages/About";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
};

export default App;
