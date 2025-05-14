import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handelChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const { email, password } = formData;

    // Validations
    if (!email) {
      toast.error("Email field is required");
      return;
    }

    if (!password) {
      toast.error("Enter Password");
      return;
    }

    const emailex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    try {
      const response = await axios.post("https://novelwebbsckend.onrender.com/api/login", formData,{
         withCredentials: true,
      });
      const { token } = response.data;

      if (token) {
        Cookies.set("token", token, { expires: 7, secure: true, sameSite: 'Strict' });
        Cookies.set("email", email);

        toast.success("Login successfully");

        setTimeout(() => {
          navigate("/home");
        }, 1500);

        setFormData({ email: "", password: "" });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
          <h3 className="text-center mb-3">Login</h3>
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter Your Email"
                value={formData.email}
                onChange={handelChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control"
                placeholder="Enter Your Password"
                value={formData.password}
                onChange={handelChange}
              />
            </div>
            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input"
                id="showPasswordCheck"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label className="form-check-label text-dark" htmlFor="showPasswordCheck">
                Show Password
              </label>
            </div>
            <div className="mb-3 text-end fw-bold ">
              <Link className='text-secondary text-decoration-none' to="/forget">Forget Password?</Link>
                          </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
            <div className="mt-2 text-center">
              <Link className='text-secondary text-decoration-none fw-bold' to="/">Don't have an account? Register</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
