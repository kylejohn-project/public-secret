import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import BuyTickets from "./pages/BuyTickets";
import DJs from "./pages/DJs";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminCheckIn from "./pages/admin/AdminCheckIn";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {children}

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/tickets"
          element={
            <Layout>
              <BuyTickets />
            </Layout>
          }
        />

        <Route
          path="/djs"
          element={
            <Layout>
              <DJs />
            </Layout>
          }
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          element={<ProtectedAdminRoute />}
        >
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              index
              element={<AdminDashboard />}
            />

            <Route
              path="orders"
              element={<AdminOrders />}
            />

            <Route
              path="check-in"
              element={<AdminCheckIn />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;