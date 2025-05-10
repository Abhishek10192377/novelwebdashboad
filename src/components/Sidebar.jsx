import React, { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { FaBars, FaTimes } from 'react-icons/fa';
import Cookies from "js-cookie"
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button, Spinner } from 'react-bootstrap';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showModel, setShowModal] = useState(false)


  const handleLogout = () => {
    toast.success("Logout Successful")
    Cookies.remove("email");
    Cookies.remove("token");
    navigate("/");
    window.location.reload()
  };

  
  return (
    <>
      <ToastContainer />
      {/* Toggle Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h1 className="name">Dashboard</h1>
        <SidebarLink to="/home" label="Home" icon="bi bi-house-door" active={location.pathname === '/home'} />
        <SidebarLink to="/category" label="Category" icon="bi bi-grid" active={location.pathname === '/category'} />
        <SidebarLink to="/bookinsert" label="Book Insert" icon="bi bi-journal-plus" active={location.pathname === '/bookinsert'} />
        <SidebarLink to="/userdata" label="User Data" icon="bi bi-person" active={location.pathname === '/userdata'} />

        <button onClick={()=>setShowModal(true)}>Logout</button>
      </div>
      <Modal
        show={showModel}
        onHide={() => setShowModal(false)}
        centered
      >
        <div
          className="container fw-bold text-center"
          style={{
            maxWidth: '300px',
            height: '200px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h5 className="mb-4 text-danger">Are you sure you want to logout?</h5>
          <div className="d-flex justify-content-around">
            <Button variant="success" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function SidebarLink({ to, label, icon, active }) {
  return (
    <Link to={to} className={active ? "active" : ""}>
      <i className={icon} style={{ fontSize: '20px' }}></i>
      {label}
    </Link>
  );
}

export default Sidebar;
