import React, { useState, useEffect } from 'react';
import AppointmentForm from './AppointmentForm'
import styles from "./Dashboard.module.css";


function Dashboard() {
    const [appointments, setAppointments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [newAppointment, setNewAppointment] = useState({
        date: '',
        title: '',
        status: 'scheduled',
        description: '',
    });
    

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



    const handleOpenModal = (appointment = null) => {
        if (appointment) {
            setEditingAppointment(appointment);
            setNewAppointment({
                date: appointment.date,
                title: appointment.title,
                status: appointment.status,
                description: appointment.description,
            });
        } else {
            setNewAppointment({
                date: '',
                title: '',
                status: 'scheduled',
                description: '',
            });
            setEditingAppointment(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
            setIsModalOpen(false);
        };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAppointment({
            ...newAppointment,
            [name]: value,
        });
    };


    const handleSubmitNewAppointment = (appointmentData) => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:3000/api/v1/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(appointmentData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.appointment) {
                        setAppointments((prevAppointments) => [...prevAppointments, data.appointment]);
                        handleCloseModal();
                    }
                })
                .catch((error) => console.error('Error creating appointment:', error));
        }
    };

    const handleSubmitUpdateAppointment = (appointmentData) => {
        const token = localStorage.getItem('token');
        if (token && editingAppointment) {
            fetch(`http://localhost:3000/api/v1/appointments/${editingAppointment._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(appointmentData),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.appointment) {
                        // Обновляем список встреч с новым состоянием
                        setAppointments(
                            appointments.map((app) =>
                                app._id === data.appointment._id ? data.appointment : app
                            )
                        );
                        handleCloseModal();
                    }
                })
                .catch((error) => console.error('Error updating appointment:', error));
        }
    };


    // Функция удаления
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
                    // Обновляем список записей, удаляя нужную
                    setAppointments((prevAppointments) =>
                        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
                    );
                })
                .catch((error) => console.error('Error deleting appointment:', error));
        }
    };



    return (
        <div className={styles.dashContainer}>  {/* основная картинка */}
            <div className={styles.dashWorkingTable}>

                {/* =======================TOOLS================ */}
                <div className={styles.dashTools}>
                    <h2>Tools</h2>
                    <button onClick={handleOpenModal} className={styles.createAppButton}>
                        Create Appointment
                    </button>
                    {isModalOpen && (
                        <AppointmentForm
                        onSubmit={editingAppointment ? handleSubmitUpdateAppointment : handleSubmitNewAppointment}
                        closeModal={handleCloseModal}
                        className={styles.createAppModal}
                        appointment={newAppointment} // передаем данные для редактирования
                        handleInputChange={handleInputChange} // передаем функцию для обработки изменений
                        />
                    )}
                {/* ================= FILTERS =================== */}
                    <button>Tomorrow</button>
                    <button>Week view</button>
                    <button>Month view</button>
                </div>

                {/*= ========================TODAY =============*/}
                <div className={styles.todayAppointmentList}>
                    <h2>Today</h2>
                </div>    

                {/* ==========================ALL =============*/}
                <div className={styles.allAppointmentList}>
                    <h2>All Appointments</h2>
                    <div className={styles.allAppBox}>
                        {appointments
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((appointment) => (
                                <div key={appointment._id} className={styles.appointmentItem}>
                                    <h3>{appointment.title}</h3>
                                    <p><strong>Date: </strong>{appointment.date
                                        ? new Date(appointment.date).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                        })
                                        : "No Date"}</p>
                                    <p><strong>Status: </strong> {appointment.status}</p>
                                    <p><strong>Description: </strong>{appointment.description}</p>
                                    <button onClick={() => handleOpenModal(appointment)}>Edit</button>
                                    <button onClick={() => handleDeleteAppointment(appointment._id)} className={styles.deleteButton}>
                                        Delete
                                    </button>
                                </div>
                        ))}   
                    </div>                    
                </div>
            </div>                
        </div>
    );
}

export default Dashboard;