import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const User = () => {
    const [users, setUsers] = useState([]);
    const [showModel, setShowModal] = useState(false)
    const [selectedDeleteId,setSelectedDeleteId]= useState(null)
    const fetchUserdata = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/userdatashowADMIN');
            setUsers(response.data.userdata); // Assuming response structure is { userdata: [...] }
        } catch (error) {
            console.log('Data fetch error:', error);
        }
    };

    const deleteHandler = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/userdelete/${id}`)
            fetchUserdata();
        } catch (error) {
            console.error('Error deleting:', err);
        }
    }
    useEffect(() => {
        fetchUserdata();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="mb-4 fw-bold fs-1">User List</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Comments</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        <ul>
                                            {user.comments.map((comment, i) => (
                                                <li key={i} className="d-flex align-items-center mb-2">
                                                    <img
                                                        src={comment.image}
                                                        alt={user.name}
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
                                                    />
                                                    <p className="ms-3 mb-0 text-muted">{comment.message}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>
                                        <button className='btn btn-danger btn-sm' onClick={() => {setSelectedDeleteId(user._id);setShowModal(true)}}>Remove</button>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
                    <h5 className="mb-4 text-danger">Are you sure you want to delete user?</h5>
                    <div className="d-flex justify-content-around">
                        <Button variant='success' onClick={() => setShowModal(false)}>Cancel</Button>
                        <Button variant='danger' onClick={() => { deleteHandler(selectedDeleteId); setShowModal(false); }}>Delete</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default User;
