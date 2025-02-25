import React, { useState, useEffect } from 'react';
import AppointmentForm from './AppointmentForm';
import styles from "./Dashboard.module.css";
import Clock from "./Clock";
import WeekViewChart from "./WeekViewChart";

function Dashboard() {
    const [appointments, setAppointments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        title: '',
        status: 'scheduled',
        description: '',
    });
    const [activeTab, setActiveTab] = useState('today');
    const [currentPageReminders, setCurrentPageReminders] = useState(1);
    const [currentPageAppointments, setCurrentPageAppointments] = useState(1);
    const itemsPerPage = 8;
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterDate, setFilterDate] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };    

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${apiUrl}/appointments`, {
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


    useEffect(() => {
        setCurrentPageAppointments(1);
        setCurrentPageReminders(1);
    }, [filterStatus, filterDate, activeTab]);


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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (appointmentData) => {
        const token = localStorage.getItem('token');
        const isEditing = appointmentData._id;
        if (token) {
            const method = isEditing ? 'PATCH' : 'POST';
            const url = isEditing
                ? `${apiUrl}/appointments/${appointmentData._id}`
                : `${apiUrl}/appointments`;

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
                        handleCloseModal();
                    }
                })
                .catch((error) => console.error('Error submitting appointment:', error));
        }
    };


    const handleDeleteAppointment = (appointmentId) => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${apiUrl}/appointments/${appointmentId}`, {
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
    today.setHours(0, 0, 0, 0);
    
    const upcomingAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= today;
    });
    
    const filteredAppointments = upcomingAppointments.filter((appointment) => 
        filterStatus === "all" || appointment.status === filterStatus
    );
    
    const finalFilteredAppointments = filteredAppointments.filter((appointment) => {
        if (!filterDate) return true;
        const appointmentDate = new Date(appointment.date);
        const formattedAppointmentDate = appointmentDate.toLocaleDateString('en-CA');
        return formattedAppointmentDate === filterDate;
    });


    const getFilteredAppointments = (day) => {
        const filterDate = new Date();
        if (day === 'tomorrow') {
            filterDate.setDate(filterDate.getDate() + 1);
        }
        filterDate.setHours(0, 0, 0, 0);
    
        return appointments.filter((appointment) => {
            const appointmentDate = new Date(appointment.date);
            return (
                appointmentDate.getFullYear() === filterDate.getFullYear() &&
                appointmentDate.getMonth() === filterDate.getMonth() &&
                appointmentDate.getDate() === filterDate.getDate()
            );
        });
    };


    const paginatedReminders = getFilteredAppointments(activeTab)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice((currentPageReminders - 1) * itemsPerPage, currentPageReminders * itemsPerPage);

    const paginatedAppointments = finalFilteredAppointments
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice((currentPageAppointments - 1) * itemsPerPage, currentPageAppointments * itemsPerPage);


    return (       
        <div className={styles.dashContainer}>
            <div className={styles.dashWorkingTable}>
                {/* ======================TOOLS CONTAINER================================ */}
                <div className={styles.dashToolsContainer}>
                    <div className={styles.dashTools}>
                        <Clock />
                    </div>
                    
                    <div className={styles.dashTools}>
                        <h2>New Appointment</h2>
                        <button onClick={() => handleOpenModal()} className={styles.createAppButton}>
                            + Add
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

                    <div className={styles.dashTools}>
                        <WeekViewChart appointments={appointments} />
                    </div>
                </div>

    {/* ============================FOR TODAY / TOMORROW */}
                <div className={styles.todayAppointmentList}>
                    <h2>Reminder</h2>
                    <div className={styles.tabContainer}>
                        <button
                            className={activeTab === 'today' ? styles.activeTab : ''}
                            onClick={() => setActiveTab('today')}
                        >Today
                        </button>
                        <button
                            className={activeTab === 'tomorrow' ? styles.activeTab : ''}
                            onClick={() => setActiveTab('tomorrow')}
                        >Tomorrow
                        </button>
                    </div>

                    <div className={styles.appointmentListBox}>
                        <h3>{activeTab === 'today' ? "Your Day Today" : "Your Day Tomorrow"}</h3>
                        <div className={styles.appointmentList}>
                            
                            {paginatedReminders.length > 0 ? (
                                paginatedReminders.map((appointment) => (
                                        <div key={appointment._id} 
                                        className={`${styles.appointmentItemToday} 
                                        ${appointment?.status === 'completed' ? styles.completed : ''} 
                                        ${appointment?.status === 'canceled' ? styles.canceled : ''}
                                        ${appointment?.status === 'no show' ? styles.noshow : ''}`}>
                                            <div className={styles.appItemOne}>
                                                <p>{new Date(appointment.date)
                                                    .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                </p>
                                            </div>
                                            <div className={styles.appItemTwo}>
                                                <h3>{appointment.title}</h3>
                                                <p><strong>Status: </strong>{appointment.status}</p>
                                                <p><strong>Description: </strong>{appointment.description}</p>
                                            </div>
                                        </div>                                        
                                    ))
                            ) : (
                                <p>No appointments for {activeTab === 'today' ? "today" : "tomorrow"}.</p>
                            )}
                        </div>                        
                    </div>

                    <div className={styles.pagination}>
                        <button onClick={() => setCurrentPageReminders(currentPageReminders - 1)} 
                                disabled={currentPageReminders === 1}>
                            Previous
                        </button>
                        <span>Page {currentPageReminders}</span>
                        <button onClick={() => setCurrentPageReminders(currentPageReminders + 1)}
                                disabled={currentPageReminders >= Math.ceil(getFilteredAppointments(activeTab).length / itemsPerPage)}>
                            Next
                        </button>
                    </div>                    
                </div>
                
    {/*=====================APPOINTMENT CONTAINER=============================  */}
                <div className={styles.allAppointmentContainer}>
                    <h2>All Appointments</h2>
                    <div className={styles.filtersContainer}>
                        <div className={styles.filterContainer}>
                            <label htmlFor="dateFilter" className={styles.filterLabel}>Filter by Date: </label>
                            <input 
                                type="date" 
                                id="dateFilter" 
                                value={filterDate} 
                                onChange={(e) => setFilterDate(e.target.value)} 
                                className={styles.filterInput}
                            />
                        </div>

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
                                <option value="no show">No show</option>
                            </select>
                        </div>
                    </div>                    

                    <div className={styles.allAppBox}>
                        {paginatedAppointments.length > 0 ? (
                            paginatedAppointments.map((appointment) => (
                                    <div key={appointment._id} 
                                        className={`${styles.appointmentItem} 
                                        ${appointment.status === 'completed' ? styles.completed : ''} 
                                        ${appointment.status === 'canceled' ? styles.canceled : ''}
                                        ${appointment.status === 'no show' ? styles.noshow : ''}`}>
                                        <div>
                                            <h3>{appointment.title}</h3>
                                            <p><strong>Date: </strong>{appointment.date ? formatDate(appointment.date) : "No Date"}</p>
                                            <p><strong>Status: </strong>{appointment.status}</p>
                                            <p><strong>Description: </strong>{appointment.description}</p>
                                        </div>
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

                    <div className={styles.pagination}>
                        <button onClick={() => setCurrentPageAppointments(currentPageAppointments - 1)}
                            disabled={currentPageAppointments === 1}>Previous</button>
                        <span>Page {currentPageAppointments}</span>
                        <button onClick={() => setCurrentPageAppointments(currentPageAppointments + 1)}
                                disabled={currentPageAppointments >= Math.ceil(finalFilteredAppointments.length / itemsPerPage)}>
                                Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;