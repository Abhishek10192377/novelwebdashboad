import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from 'react-bootstrap';
const Forgetpassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: ""
  });

  const navigate = useNavigate();

  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendotp = async (event) => {
    event.preventDefault();
    const { email } = formData;

    if (!email) {
      toast.error("Email is required");
      return;
    }
    const emailex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailex.test(email)) {
      toast.error("Invalid email format");
      return;
    }
    try {
      setIsLoading(true)
      await axios.post("https://novelwebbsckend.onrender/api/forget", { email })
      toast.success("OTP sent successfully to your email")
      setIsLoading(false)

    } catch (error) {
      setIsLoading(false)
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  const updateHandler = async (event) => {
    event.preventDefault()
    const { email, otp, password } = formData
    if (!email || !otp || !password) {
      toast.error("Please fill all fields");
      return;
    }

    if (password.length < 6 || password.length > 8) {
      toast.error("Password must be between 6 and 8 characters");
      return;
    }
    try {
      setIsLoading(true)
      const response = await axios.post(" https://novelwebbsckend.onrender/api/verifyotp", {
        email,
        otp,
        password
      })
      toast.success(response.data.message)
      setTimeout(() => {
        navigate('/login')
        window.location.reload();
      }, 1000)
    } catch (error) {
      setIsLoading(false)
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  return (
    <>
      <ToastContainer autoClose={1000} theme='dark' />
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
          <h3 className="text-center mb-3">Forget Password</h3>
         
          <form onSubmit={sendotp}>
            <div className="mb-3 mt-3">
              <label className="form-label">Email address</label>
              <input type="text" name="email" className="form-control" placeholder="Enter Your Email" value={formData.email} onChange={handelChange} />
            </div>
            <button type="submit" className="btn btn-primary w-100"> {isLoading ? <Spinner animation='border' size='sm' /> : 'Send OTP'}</button>

          </form>
          {formData.email && (
            <form onSubmit={updateHandler} >
              <div className="mb-3">
                <label className="form-label">OTP</label>
                <input type="text" name="otp" className="form-control" placeholder="Enter OTP" value={formData.otp} onChange={handelChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input type={showPassword ? 'text' : 'password'} name="password" className="form-control" placeholder="Enter Your Password" value={formData.password} onChange={handelChange} />
              </div>
              <div className="form-check mb-4">
                <input type="checkbox" className="form-check-input" id="showPasswordCheck" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                <label className="form-check-label text-dark" htmlFor="showPasswordCheck">Show Password</label>
              </div>
              
              <button type="submit" className="btn btn-primary w-100"> {isLoading ? <Spinner animation='border' size='sm' /> : 'Submit'}</button>
            </form>

          )}
          <div className="mt-2 text-center">
            <Link className='text-secondary text-decoration-none fw-bold' to="/login">Back to login page </Link>
          </div>
        </div>
       
      </div>
    </>
  );
};

export default Forgetpassword;
