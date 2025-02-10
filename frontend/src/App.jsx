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
  const navigate = useNavigate(); // Для переходов на другие страницы

  useEffect(() => { // Проверка, есть ли токен в localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // Если токен есть, считаем, что пользователь авторизован
    }
  }, []);

  const handleLogout = () => {    // Функция для выхода из системы (удаляет токен)
    localStorage.removeItem('token');
    setIsAuthenticated(false);
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

  const handleSuccessLogin = () => {
    closeModal();
    setIsAuthenticated(true); // Устанавливаем, что пользователь авторизован
    navigate('/dashboard'); // Переходим на страницу Dashboard
  };

  return (
    <div className={styles.appContainer}>
      <nav className={styles.nav}>
        <NavLink to="/">SyncMate</NavLink>
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

