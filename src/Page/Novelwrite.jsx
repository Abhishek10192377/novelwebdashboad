import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button } from 'react-bootstrap';

const Novelwrite = () => {
  const { id } = useParams();
  const editorRef = useRef(null);
  const hasLoadedRef = useRef(false);

  const [novels, setNovels] = useState([]);
  const [bookName, setBookName] = useState("Selected Book");
  const [bookImage, setBookImage] = useState("/default-book.jpg");
  const [bookAuthor, setBookAuthor] = useState("Selected Author");
  const [loading, setLoading] = useState(true);
  const [novelExists, setNovelExists] = useState(false);
  const [novelId, setNovelId] = useState(null);
  const [showModel, setShowModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  // Optional: Validate image before setting it
  const isValidImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  const fetchNovels = async () => {
    try {
      const res = await axios.get(`https://novelwebbsckend.onrender/api/novels/read/${id}`);
      const fetchdata = res.data.data;
      setNovels(fetchdata);

      if (fetchdata.length > 0 && fetchdata[0].Book) {
        const book = fetchdata[0].Book;
        setBookName(book.title);
        setBookAuthor(book.author);

        const valid = await isValidImage(book.image);
        setBookImage(valid ? book.image : "/default-book.jpg");
      }

      if (fetchdata.length > 0) {
        setNovelExists(true);
        setNovelId(fetchdata[0]._id);

        if (!hasLoadedRef.current) {
          editorRef.current.innerHTML = fetchdata[0].message;
          hasLoadedRef.current = true;
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNovels();
  }, [id]);

  const submitHandler = async (event) => {
    event.preventDefault();
    const message = editorRef.current.innerHTML;

    try {
      if (novelExists) {
        await axios.put(`https://novelwebbsckend.onrender/api/novels/update/${novelId}`, { message });
        toast.success("Novel updated successfully!");
      } else {
        await axios.post("https://novelwebbsckend.onrender/api/novels/insert", { message, Book: id });
        toast.success("Novel inserted successfully!");
        setNovelExists(true);
        hasLoadedRef.current = false;
        fetchNovels();
      }
    } catch (error) {
      toast.error("Error inserting novel: " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`https://novelwebbsckend.onrender/api/novels/delete/${id}`);
      setNovelExists(false);
      setNovelId(null);
      editorRef.current.innerHTML = "Start typing here...";
      hasLoadedRef.current = false;
      fetchNovels();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <ToastContainer autoClose={1000} />
      <h2 className="text-center fw-bold mb-4">{bookName}</h2>

      <div className="row row-cols-xl-12 g-4 mb-5">
        <div className="col">
          <div className="card h-100 text-center p-3 border-0 shadow-sm">
            <img
              src={bookImage}
              alt={bookName}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-book.jpg";
              }}
              className="card-img-top rounded"
              style={{
                height: "300px",
                width: "200px",
                objectFit: "cover",
                marginBottom: "20px",
                alignSelf: "center",
              }}
            />
            <div className="card-body px-0">
              <h6 className="fw-bold mt-3">{bookName}</h6>
              <p className="text-muted mb-2">
                <i className="fw-bold">By:</i> {bookAuthor}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Novel Editor */}
      <div className="container mt-4 shadow-lg p-4 rounded bg-light">
        <h3 className="mb-4 fw-bold">Write Novel</h3>

        <form onSubmit={submitHandler}>
          <div
            ref={editorRef}
            contentEditable={true}
            className="border border-warning border-3 rounded p-3 bg-white"
            style={{
              minHeight: "500px",
              maxHeight: "500px",
              overflowY: "auto",
              overflowX: "auto",
            }}
          >
            {novelExists ? "" : "Start typing here..."}
          </div>

          <div className="text-center m-3 d-flex justify-content-center gap-3">
            <button type="submit" className="btn btn-success px-4">
              <i className="bi bi-save me-2"></i>
              {novelExists ? "Update" : "Submit"}
            </button>

            <button
              type="button"
              className="btn btn-danger px-4"
              onClick={() => {
                setSelectedDeleteId(novelId);
                setShowModal(true);
              }}
              disabled={!novelExists}
            >
              <i className="bi bi-trash3 me-2"></i>
              Delete
            </button>
          </div>
        </form>
      </div>

      <Modal show={showModel} onHide={() => setShowModal(false)} centered>
        <div
          className="container fw-bold text-center"
          style={{
            maxWidth: "300px",
            height: "200px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h5 className="mb-4 text-danger">Are you sure you want to delete this novel?</h5>
          <div className="d-flex justify-content-around">
            <Button variant="success" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteHandler(selectedDeleteId);
                setShowModal(false);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Novelwrite;
