import React, { useState, useEffect } from 'react';
import AppointmentForm from './AppointmentForm'
import styles from "./Dashboard.module.css";


function Dashboard() {
    const [appointments, setAppointments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
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



    const handleOpenModal = () => {
        // Сбрасываем данные формы перед открытием модального окна
        setNewAppointment({
            date: '',
            title: '',
            status: 'scheduled',
            description: '',
        });
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
                            onSubmit={handleSubmitNewAppointment}
                            closeModal={handleCloseModal}
                            className={styles.createAppModal}
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
                                </div>
                        ))}   
                    </div>                    
                </div>
            </div>                
        </div>
    );
}

export default Dashboard;