import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button, Spinner } from 'react-bootstrap';
const Category = () => {
  const [readCategory, setReadCategory] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showModel, setShowModal] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const fetchCategory = async () => {
    try {
      const res = await axios.get('https://novelwebbsckend.onrender.com/api/read_category');
      setReadCategory(res.data.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', e.target.title.value);
    formData.append('category_description', e.target.category_description.value);
    formData.append('file', e.target.file.files[0]);

    try {
      await axios.post('https://novelwebbsckend.onrender.com/api/insert_category', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
       toast.success("Category inserted successfully!");
      e.target.reset();
      fetchCategory();
    } catch (error) {
      toast.error("Error inserting book: " + (error.response?.data?.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append('title', e.target.title.value);
    formData.append('category_description', e.target.category_description.value);
    const image = e.target.file.files[0];
    if (image) formData.append('file', image);

    try {
      await axios.put(`https://novelwebbsckend.onrender.com/api/update_category/${editData._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('category Update Successfully')
      setEditData(null);
      fetchCategory();
      e.target.reset();
    } catch (error) {
      toast.error("Error updating category: " + (error.response?.data?.message || "Something went wrong"));
    } finally {
      setUpdating(false);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`https://novelwebbsckend.onrender.com/api/delete_category/${id}`);
      fetchCategory();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const cancelEdit = () => {
    setEditData(null);
  };

  return (
   
    <div className="container py-4">
       <ToastContainer/>
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-3 fw-bold">
              {editData ? 'Update Book Category' : 'Add Book Category'}
            </h2>
            <form onSubmit={editData ? updateHandler : submitHandler}>
              <div className="mb-3">
                <label className="form-label">Category Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  required
                  defaultValue={editData?.title || ''}
                  placeholder="Enter Category Title"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  name="file"
                  className="form-control"
                  required={!editData}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  name="category_description"
                  className="form-control"
                  rows="3"
                  required
                  defaultValue={editData?.category_description || ''}
                  placeholder="Enter Description"
                ></textarea>
              </div>

              <div className="d-flex justify-content-between gap-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || updating}
                >
                  {loading
                    ? 'Submitting...'
                    : updating
                      ? 'Updating...'
                      : editData
                        ? 'Update'
                        : 'Submit'}
                </button>

                {editData && (
                  <button
                    type="button"
                    className="btn btn-secondary w-100"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="card shadow-sm p-3">
        <h3 className="text-center mb-3">All Book Categories</h3>
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {readCategory.map((category, index) => (
                <tr key={category._id}>
                  <td>{index + 1}</td>
                  <td>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt="category"
                        className="rounded"
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>{category.title}</td>
                  <td>{category.category_description}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => setEditData(category)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => { setSelectedDeleteId(category._id); setShowModal(true)}}
                      
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {readCategory.length === 0 && (
                <tr>
                  <td colSpan="5">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={showModel} onHide={() => setShowModal(false)}

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
          <h5 className="mb-4 text-danger">Are you sure you want to delete category?</h5>
          <div className="d-flex justify-content-around">
          <Button variant='success' onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant='danger' onClick={() => { deleteHandler(selectedDeleteId); setShowModal(false); }}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>

  );
};

export default Category;
