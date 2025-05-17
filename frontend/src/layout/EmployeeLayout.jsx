import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const API_URL = "http://localhost/emsystem/backend/index.php?action=";

const EmployeeLayout = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          `${API_URL}checkAuth`,
          {},
          { withCredentials: true }
        );

        if (response.data.type !== "success") {
          localStorage.removeItem("isLoggedin");
          navigate("/");
        } else {
            const response = await axios.post(
                `${API_URL}fetchUserDetails`,
                {},
                { withCredentials: true }
              );
        
              setUser(response.data.user);
        }

        switch (response.data.role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "hr":
            navigate("/hr/employees");
            break;
        }

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await axios.post(`${API_URL}logoutUser`, {}, { withCredentials: true });

    localStorage.removeItem("isLoggedin");
    navigate("/");
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full font-sans">
      <header className="w-full bg-gradient-to-r from-[#260058] to-[#3e0091] shadow-lg">
        <div className="w-full px-6 md:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden border-2 border-white/20">
                {user?.avatar ? (
                  <img
                    src={`data:image/jpeg;base64,${user?.avatar}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "E"
                )}
              </div>
              <span className="text-2xl font-bold text-white tracking-wide">
                Employee Portal
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
              <Link
                to="/employee/home"
                className="relative px-2 py-1 transition-all duration-200 hover:text-white"
              >
                Home
              </Link>
              <Link
                to="/employee/profile"
                className="relative px-2 py-1 transition-all duration-200 hover:text-white"
              >
                Profile
              </Link>
            </nav>

            <div className="flex items-center gap-6">
              <span className="hidden sm:block text-sm font-medium text-white/90">
                Welcome back, <span className="text-white font-semibold">{user?.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full p-6">
        <Outlet context={{ user, setUser }} />
      </main>

      <Footer />
    </div>
  );
};

export default EmployeeLayout;
