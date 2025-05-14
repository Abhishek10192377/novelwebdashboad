import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const BookInsert = () => {
  const [readCategory, setReadCategory] = useState([]);
  const [readBook, setReadBook] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setloading] = useState(false);
  const [updating, setupdating] = useState(false);
  const [showModel, setShowModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchCategory = async () => {
    try {
      const response = await axios.get("https://novelwebbsckend.onrender.com/api/read_category");
      setReadCategory(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchBook = async () => {
    try {
      const response = await axios.get("https://novelwebbsckend.onrender.com/api/books/allRead");
      setReadBook(response.data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    setloading(true);
    const formData = new FormData();
    formData.append('title', event.target.title.value);
    formData.append('author', event.target.author.value);
    formData.append('details', event.target.details.value);
    formData.append('file', event.target.file.files[0]);
    formData.append('category', event.target.category.value);
    formData.append('isPopular', event.target.isPopular.checked);
    try {
      await axios.post("https://novelwebbsckend.onrender.com/api/books/insert", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Book inserted successfully!");
      event.target.reset();
      fetchBook();
    } catch (error) {
      toast.error("Error inserting book: " + (error.response?.data?.message || "Something went wrong"));
    } finally {
      setloading(false);
    }
  };

  const updateHandler = async (event) => {
    event.preventDefault();
    setupdating(true);
    const formData = new FormData();
    formData.append('title', event.target.title.value);
    formData.append('author', event.target.author.value);
    formData.append('details', event.target.details.value);
    formData.append('category', event.target.category.value);
    formData.append('isPopular', event.target.isPopular.checked);
    const file = event.target.file.files[0];
    if (file) {
      formData.append('file', file);
    }

    try {
      await axios.put(`https://novelwebbsckend.onrender.com/api/books/update/${editData._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Book Update Successfully')
      fetchBook();
      setEditData(null);
      event.target.reset();
    } catch (error) {
      toast.error("Error updating book: " + (error.response?.data?.message || "Something went wrong"));
    } finally {
      setupdating(false);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`https://novelwebbsckend.onrender.com/api/books/delete/${id}`);
      fetchBook();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
   
    <div className="py-4" style={{ background: '#f7f7f7', minHeight: '100vh' }}>
       <ToastContainer autoClose={1000}/>
      <div className="container">
        <div className="row g-4 align-items-stretch">
          <div className="col-md-12 order-2 order-md-1">
            <div className="card shadow-sm p-4 h-100 d-flex flex-column">
              <h2 className="text-center mb-4">📚 Book Insert</h2>
              <form onSubmit={editData ? updateHandler : submitHandler} className="flex-grow-1 d-flex flex-column">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">Title</label>
                      <input
                        type="text"
                        defaultValue={editData?.title || ''}
                        name="title"
                        className="form-control"
                        id="title"
                        placeholder="Enter title"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="author" className="form-label">Author</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={editData?.author || ''}
                        name="author"
                        id="author"
                        placeholder="Enter author"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">Image</label>
                      <input
                        type="file"
                        className="form-control"
                        name="file"
                        id="image"
                        required={!editData}
                      />
                    </div>
                    <div className="mt-3">
                      <label htmlFor="category" className="form-label">Category</label>
                      <select className="form-control" name="category" id="category" defaultValue={editData?.category || ''}>
                        <option value="">Select a category</option>
                        {readCategory.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="details" className="form-label">Book Details</label>
                  <textarea
                    id="details"
                    name="details"
                    defaultValue={editData?.details || ''}
                    className="form-control"
                    rows="4"
                    placeholder="Enter Book Details"
                    style={{ resize: 'none' }}
                    required
                  ></textarea>
                </div>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isPopular"
                    name="isPopular"
                    defaultChecked={editData?.isPopular || false}
                  />
                  <label className="form-check-label" htmlFor="isPopular">
                    Mark as Popular
                  </label>
                </div>
                <div className="mt-auto d-flex gap-3">
                  <button type="submit" className="btn btn-success w-100">
                    {loading ? 'Submitting...' : updating ? 'Updating...' : editData ? "Update" : "Submit"}
                  </button>
                  {editData && (
                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      onClick={() => {
                        setEditData(null);
                        document.querySelector("form").reset();
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="container mt-5">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {readBook.map((book, index) => (
                  <tr key={book._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={book.image || "default-cover.jpg"}
                        alt={book.title}
                        style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
                      />
                    </td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.details}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => navigate(`/novelwrite/${book._id}`)}
                        >
                          Write Novel
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setEditData(book)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            setShowModal(true);
                            setSelectedDeleteId(book._id);
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showModel} onHide={() => setShowModal(false)} centered>
        <div
          className='container fw-bold text-center'
          style={{
            maxWidth: '300px',
            height: '200px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h5 className='mb-4 text-center'>Are you sure you want to delete this book?</h5>
          <div className="d-flex justify-content-around">
            <Button variant='success' onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant='danger' onClick={() => {
              deleteHandler(selectedDeleteId);
              setShowModal(false);
            }}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookInsert;
