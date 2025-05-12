import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Spinner } from 'react-bootstrap';

const Register = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("https://novelwebbsckend.onrender/api/insert", formData);
      toast.success("Verification code sent to your email");
      setShowModal(true); // Show the modal to enter verification code
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode) {
      toast.error("Enter verification code");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("https://novelwebbsckend.onrender/api/verify", {
        code: verificationCode
      });

      toast.success("Admin Registered Successfully");
      setShowModal(false);
      setFormData({ name: "", email: "", password: "" });
      setVerificationCode("");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer autoClose={1500} />
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
          <h3 className="text-center mb-3">Register</h3>
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Your Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter Your Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : "Register"}
            </button>
          </form>
          <p className="text-center m-2">Already have an account?</p>
          <Link to="/login" className="btn btn-outline-primary w-100">Login</Link>
        </div>
      </div>

      {/* Verification Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <div
          className="container fw-bold text-center"
          style={{
            maxWidth: '300px',
            height: '230px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h5 className="mb-3 text-danger">Enter Verification Code</h5>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <Button variant="success" onClick={handleVerify} disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : "Verify"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Register;
