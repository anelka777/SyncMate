import React, { useState, useEffect } from 'react';
import AppointmentForm from './AppointmentForm';
import styles from "./Dashboard.module.css";

function Dashboard() {
    const [appointments, setAppointments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        title: '',
        status: 'scheduled',
        description: '',
    });
    const [activeTab, setActiveTab] = useState('today'); // "today" или "tomorrow"

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // Для 12-часового формата (AM/PM)
        });
    };

    const [filterStatus, setFilterStatus] = useState("all"); // Храним текущий фильтр

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:3000/api/v1/appointments', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.appointments) {
                        setAppointments(data.appointments);
                    }
                })
                .catch((error) => console.error('Error fetching appointments:', error));
        }
    }, []);

    // Функция открытия модального окна для добавления нового или редактирования существующего
    const handleOpenModal = (appointment = null) => {
        if (appointment) {
            setFormData({
                ...appointment,
            });
        } else {
            setFormData({
                date: '',
                title: '',
                status: 'scheduled',
                description: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Функция для изменения данных в форме
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Функция для отправки данных
    const handleSubmit = (appointmentData) => {
        const token = localStorage.getItem('token');
        const isEditing = appointmentData._id; // Проверяем, редактируем ли мы существующее назначение

        if (token) {
            const method = isEditing ? 'PATCH' : 'POST';
            const url = isEditing
                ? `http://localhost:3000/api/v1/appointments/${appointmentData._id}`
                : 'http://localhost:3000/api/v1/appointments';

            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(appointmentData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.appointment) {
                        if (isEditing) {
                            setAppointments((prevAppointments) =>
                                prevAppointments.map((app) =>
                                    app._id === data.appointment._id ? data.appointment : app
                                )
                            );
                        } else {
                            setAppointments((prevAppointments) => [
                                ...prevAppointments,
                                data.appointment,
                            ]);
                        }
                        handleCloseModal(); // Закрываем модалку после отправки
                    }
                })
                .catch((error) => console.error('Error submitting appointment:', error));
        }
    };

    // Функция удаления записи
    const handleDeleteAppointment = (appointmentId) => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`http://localhost:3000/api/v1/appointments/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then(() => {
                    setAppointments((prevAppointments) =>
                        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
                    );
                })
                .catch((error) => console.error('Error deleting appointment:', error));
        }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Убираем время

    // Сначала фильтруем по дате (оставляем будущие)
    const upcomingAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= today;
    });

    // Затем фильтруем по статусу
    const filteredAppointments = upcomingAppointments.filter((appointment) => 
        filterStatus === "all" || appointment.status === filterStatus
    );

    const getFilteredAppointments = (day) => {
        const filterDate = new Date();
        if (day === 'tomorrow') {
            filterDate.setDate(filterDate.getDate() + 1); // Завтра
        }
        filterDate.setHours(0, 0, 0, 0); // Сбрасываем время
    
        return appointments.filter((appointment) => {
            const appointmentDate = new Date(appointment.date);
            return (
                appointmentDate.getFullYear() === filterDate.getFullYear() &&
                appointmentDate.getMonth() === filterDate.getMonth() &&
                appointmentDate.getDate() === filterDate.getDate()
            );
        });
    };
    return (
        <div className={styles.dashContainer}>
            <div className={styles.dashWorkingTable}>
    {/* ============================FOR TODAY / TOMORROW */}
                <div className={styles.todayAppointmentList}>
                    <h2>Reminder</h2>
                    <div className={styles.tabContainer}>
                        <button
                            className={activeTab === 'today' ? styles.activeTab : ''}
                            onClick={() => setActiveTab('today')}
                        >
                            Today
                        </button>
                        <button
                            className={activeTab === 'tomorrow' ? styles.activeTab : ''}
                            onClick={() => setActiveTab('tomorrow')}
                        >
                            Tomorrow
                        </button>
                    </div>

                    <div className={styles.appointmentListBox}>
                        <h2>{activeTab === 'today' ? "Your Day Today" : "Your Day Tomorrow"}</h2>
                        <div className={styles.appointmentList}>
                            {getFilteredAppointments(activeTab).length > 0 ? (
                                getFilteredAppointments(activeTab)
                                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                                    .map((appointment) => (
                                        <div key={appointment._id} className={styles.appointmentItem}>
                                            <h3>{appointment.title}</h3>
                                            <p><strong>Time: </strong>{formatDate(appointment.date)}</p>
                                            <p><strong>Status: </strong>{appointment.status}</p>
                                            <p><strong>Description: </strong>{appointment.description}</p>
                                        </div>
                                    ))
                            ) : (
                                <p>No appointments for {activeTab === 'today' ? "today" : "tomorrow"}.</p>
                            )}
                        </div>                        
                    </div>
                </div>

    {/* ======================TOOLS CONTAINER================================ */}
                <div className={styles.dashTools}>
                    <h2>Tools</h2>
                    <button onClick={() => handleOpenModal()} className={styles.createAppButton}>
                        Create Appointment
                    </button>                    
                    {isModalOpen && (
                        <AppointmentForm
                            onSubmit={handleSubmit}
                            closeModal={handleCloseModal}
                            appointment={formData}
                            handleInputChange={handleInputChange}
                        />
                    )}
                </div>
    {/*=====================APPOINTMENT CONTAINER=============================  */}
                <div className={styles.allAppointmentContainer}>
                    <h2>Appointments</h2>
                    {/* Выпадающий список для фильтрации */}
                    <div className={styles.filterContainer}>
                        <label htmlFor="statusFilter" className={styles.filterLabel}>Filter by Status: </label>
                        <select 
                            id="statusFilter"
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)} 
                            className={styles.filterSelect}
                        >
                            <option value="all">All</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="canceled">Canceled</option>
                        </select>
                    </div>

                    <div className={styles.allAppBox}>
                        {filteredAppointments.length > 0 ? (
                            filteredAppointments
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .map((appointment) => (
                                    <div key={appointment._id} className={styles.appointmentItem}>
                                        <h3>{appointment.title}</h3>
                                        <p><strong>Date: </strong>{appointment.date ? formatDate(appointment.date) : "No Date"}</p>
                                        <p><strong>Status: </strong>{appointment.status}</p>
                                        <p><strong>Description: </strong>{appointment.description}</p>
                                        <div className={styles.appItemBtns}>
                                            <button onClick={() => handleOpenModal(appointment)}>Edit</button>
                                            <button
                                                onClick={() => handleDeleteAppointment(appointment._id)}
                                                className={styles.deleteButton}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <p>No appointments found for selected status.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;