import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const   Home = () => {
  const [totalbook, setTotalBook] = useState(0);
  const [totalcategory, setTotalCategory] = useState(0);
  const [totaluser, setTotalUser] = useState(0);
  const [bookovertime, setBookOverTime] = useState([]);
  const [readcategory, setReadCategory] = useState([]);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch total books
  useEffect(() => {
    axios.get("https://novelwebbsckend.onrender.com/api/books/totalbook")
      .then(response => setTotalBook(response.data.totalBooks))
      .catch(error => console.error("Error fetching total books:", error));
  }, []);

  // Fetch total categories
  useEffect(() => {
    axios.get("https://novelwebbsckend.onrender.com/api/show_Totalcategory")
      .then(response => setTotalCategory(response.data.totalCategorys))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  // Fetch total users
  useEffect(() => {
    axios.get("https://novelwebbsckend.onrender.com/api/usertotal/show")
      .then(response => setTotalUser(response.data.totalUser))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  // Fetch books over time
  useEffect(() => {
    axios.get("https://novelwebbsckend.onrender.com/api/books/showtime")
      .then(response => setBookOverTime(response.data.bookData))
      .catch(error => console.error("Error fetching book over time:", error));
  }, []);

  // Fetch read categories
  useEffect(() => {
    axios.get("https://novelwebbsckend.onrender.com/api/read_category")
      .then(response => setReadCategory(response.data.data))
      .catch(error => console.error("Error fetching read categories:", error));
  }, []);

  // Token protected route
  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      axios.get("https://novelwebbsckend.onrender.com/api/protected", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setData(response.data);
      })
      .catch(err => {
        setError('Error fetching protected data: ' + err.message);
      });
    } else {
      setError('Please log in to access this content.');
    }

    window.scrollTo(0, 0);
  }, [navigate]);

  return (
    <div className="container py-4 mt-5">
      {/* Alerts */}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {data && (
        <div className="alert alert-success text-center">
          Welcome, {data.user?.name || "User"}!
        </div>
      )}

      {/* Cards */}
      <div className="row text-center mb-4 g-4">
        <div className="col-12 col-md-4">
          <div className="card shadow border-0 bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Books</h5>
              <h2>{totalbook}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card shadow border-0 bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Categories</h5>
              <h2>{totalcategory}</h2>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card shadow border-0 bg-warning text-dark">
            <div className="card-body">
              <h5 className="card-title">Active Readers</h5>
              <h2>{totaluser}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4 mt-4">
        <div className="col-12 col-md-6">
          <div className="card shadow border-0">
            <div className="card-body">
              <h4 className="card-title mb-4">Number Of Books Published Per Month</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bookovertime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="books" stroke="#007bff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card shadow border-0">
            <div className="card-body">
              <h4 className="card-title mb-4">Popular Genres</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={readcategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#17a2b8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
