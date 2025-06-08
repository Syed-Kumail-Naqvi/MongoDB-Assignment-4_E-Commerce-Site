import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/Cart";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import AboutPage from "./pages/About";
import Dashboard from "./pages/Dashboard";
import AdminLoginPage from "./pages/AdminLogin";
import AdminRoute from "./Components/AdminRoute";
import PrivateRoute from "./Components/PrivateRoute";
import { AuthProvider } from './Context/AuthContext.jsx';
import { CartProvider } from './Context/CartContext.jsx';
import { ThemeProvider } from './Context/ThemeProvider';
import ProfilePage from "./pages/ProfilePage";
import './index.css'

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>

              {/* Normal Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/adminlogin" element={<AdminLoginPage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Protected Routes */}
              <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
              <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} /> 

            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;