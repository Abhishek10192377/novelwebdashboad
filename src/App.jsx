import React, {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./Page/Home";
import Category from "./Page/Category";
import Register from "./Page/Register";
import Login from "./Page/Login";
import BookInsert from "./Page/BookInsert";
import Novelwrite from "./Page/Novelwrite";

import User from "./Page/User";
import Forgetpassword from "./Page/Forgetpassword";


const Layout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Show sidebar only on certain routes
  const shouldShowSidebar = location.pathname !== "/login" && location.pathname !== "/";

  // Automatically hide sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex">
      {shouldShowSidebar && (
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      )}

      <main
        className="p-4 flex-grow-1"
        style={{
          marginLeft: shouldShowSidebar && sidebarOpen && window.innerWidth >= 1024 ? "250px" : "0",
          transition: "margin-left 0.3s ease",
          width: "100%",
        }}
      >
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget" element={<Forgetpassword/>}/>
          <Route path="/home" element={<Home />} />
          <Route path="/category" element={<Category />} />
          <Route path="/bookinsert" element={<BookInsert />} />
          <Route path="/novelwrite/:id" element={<Novelwrite />} />
          <Route path="/userdata" element={<User/>}/>
          <Route path="*" element={<h1 className="text-center mt-5">404 - Page Not Found</h1>} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
);

export default App;
