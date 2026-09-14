import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import BuyTickets from "./pages/BuyTickets";
import DJs from "./pages/DJs";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;