import React, { useState, useEffect } from 'react';
import { Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import Signup from '../components/Signup';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import styles from './App.module.css';
import Modal from 'react-modal';
import "./index.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [userName, setUserName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem("userName");
    if (token) {
      setIsAuthenticated(true);
      fetchAppointments();
    }
    if (storedUserName) {
      setUserName(storedUserName);
    } 
  }, []);


const fetchAppointments = async () => {
  try {
    const response = await fetch(`${apiUrl}/appointments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    setAppointments(data);
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserName("");
    setAppointments([]);
    navigate('/');
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccessSignup = () => {
    closeModal();
    setTimeout(() => {
      openModal('login');
    }, 500);
  };

  const handleSuccessLogin = (data) => {
    closeModal();
    setIsAuthenticated(true);
    if (data.user && data.user.name) { 
      localStorage.setItem("userName", data.user.name);
      setUserName(data.user.name);
    } 
    navigate('/dashboard');
    fetchAppointments();
  };

  return (
    <div className={styles.appContainer}>
      <nav className={styles.nav}>
        <NavLink 
          to="/"
          className={isAuthenticated ? styles.disabledLink : ""}
          tabIndex={isAuthenticated ? -1 : 0}
        >
          SyncMate
        </NavLink>
        {isAuthenticated && userName && <span className={styles.userName}>Hello, {userName}!</span>}
        <div className={styles.authButtons}>
          {!isAuthenticated && <button onClick={() => openModal('login')}>Log in</button>}
          {isAuthenticated && (
            <button onClick={handleLogout}>Logout</button>
          )}
          {!isAuthenticated && (
            <button onClick={() => openModal('signup')}>Sign up</button>
          )}
        </div>
      </nav>

      <div className={styles.pageContent}>
        <Routes>
          <Route path="/" element={
              <div className={styles.appHomePage}>
                <div className={styles.appHomeBox}>
                  <h1>Welcome to SyncMate</h1>
                  <h3>Use your time wise</h3>
                </div>
                
              </div>
            }
          />
          <Route 
            path="/signup" 
            element={<Signup handleSuccess={handleSuccessSignup} closeModal={closeModal} />} 
          />
          <Route 
            path="/login" 
            element={<Login handleSuccess={handleSuccessLogin} />} 
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>

      <Modal isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        ariaHideApp={false}
        className={styles.appModal}
        overlayClassName={styles.appModalOverlay}
      >
        {modalType === 'login' && (
          <Login handleSuccess={handleSuccessLogin} closeModal={closeModal} />
        )}
        {modalType === 'signup' && (
          <Signup handleSuccess={handleSuccessSignup} closeModal={closeModal} />
        )}
      </Modal>
    </div>
  );  
}

export default App;

