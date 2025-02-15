import React, { useState, useEffect } from 'react';
import { Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import Signup from '../components/Signup';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import styles from './App.module.css';
import Modal from 'react-modal';
import "./index.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Состояние для проверки, авторизован ли user
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для открытия мод окна
  const [modalType, setModalType] = useState(null); // Тип мод окна (login или signup)
  const [userName, setUserName] = useState("");
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate(); // Для переходов на другие страницы


  useEffect(() => { // Проверка, есть ли токен в localStorage
    const token = localStorage.getItem('token');
    const storedUserName = localStorage.getItem("userName");
    if (token) {
      setIsAuthenticated(true); // Если токен есть, считаем, что пользователь авторизован
      fetchAppointments();
    }
    if (storedUserName) {
      setUserName(storedUserName);
    } 
  }, []);

// Функция для загрузки appointments с сервера
const fetchAppointments = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/appointments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Передаем токен для авторизации
      },
    });
    const data = await response.json();
    setAppointments(data); // Сохраняем appointments в стейте
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};


  const handleLogout = () => {    // Функция для выхода из системы (удаляет токен)
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserName("");
    setAppointments([]); // Очищаем appointments при выходе
    navigate('/');
  };

  const openModal = (type) => {
    setModalType(type); // Устанавливаем тип мод окна (login или signup)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccessSignup = () => {
    closeModal();
    navigate('/login'); // Переходим на страницу login после успешной регистрации
  };

  const handleSuccessLogin = (data) => { //NAME
    closeModal();
    setIsAuthenticated(true); // Устанавливаем, что пользователь авторизован
    if (data.user && data.user.name) { //NAME
      localStorage.setItem("userName", data.user.name); // NAME
      setUserName(data.user.name);
    } //NAME
    navigate('/dashboard'); // Переходим на страницу Dashboard
    fetchAppointments(); // После успешного входа загружаем appointments
  };

  return (
    <div className={styles.appContainer}>
      <nav className={styles.nav}>
        <NavLink to="/">SyncMate</NavLink>
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
                <h1>Welcome to SyncMate</h1>
                <h3>Slogan</h3>
              </div>
            }
          />
          <Route 
            path="/signup" 
            element={<Signup handleSuccess={handleSuccessSignup} />} 
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

