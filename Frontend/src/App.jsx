import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/Cart";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import AboutPage from "./pages/About";
import Dashboard from "./pages/Dashboard";
import AdminRoute from "./Components/AdminRoute";
import PrivateRoute from "./Components/PrivateRoute";
import AdminLoginPage from "./pages/AdminLogin";
import './index.css'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/adminlogin" element={<AdminLoginPage />} />
        <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      </Routes>
    </Router>
  );
};

export default App;