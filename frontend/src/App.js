import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import StudentDash from "./pages/student/Dashboard";
import Chat from "./pages/student/Chat";
import Order from "./pages/student/Order";
import Book from "./pages/student/Book";
import Track from "./pages/student/Track";
import ShopDash from "./pages/shop/Dashboard";
import DeliveryDash from "./pages/delivery/Dashboard";
import DoctorDash from "./pages/doctor/Dashboard";
import { useAuth } from "./context/AuthContext";

const Protected = ({ role, children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="dash" style={{textAlign:"center", padding:50}}><h3>Loading Session...</h3></div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} />;
  return children;
};

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/student" element={<Protected role="student"><StudentDash /></Protected>} />
        <Route path="/student/chat" element={<Protected role="student"><Chat /></Protected>} />
        <Route path="/student/order" element={<Protected role="student"><Order /></Protected>} />
        <Route path="/student/book" element={<Protected role="student"><Book /></Protected>} />
        <Route path="/student/track" element={<Protected role="student"><Track /></Protected>} />

        <Route path="/shop" element={<Protected role="shop"><ShopDash /></Protected>} />
        <Route path="/delivery" element={<Protected role="delivery"><DeliveryDash /></Protected>} />
        <Route path="/doctor" element={<Protected role="doctor"><DoctorDash /></Protected>} />
      </Routes>
    </>
  );
}
