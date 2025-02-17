import React, { useState, useEffect } from 'react';
import styles from './AppointmentForm.module.css';

function AppointmentForm({ onSubmit, closeModal, appointment, handleInputChange }) {
    // Локальное состояние с инициализацией от appointment
    const [formData, setFormData] = useState({
        date: '',
        title: '',
        status: 'scheduled',
        description: '',
    });

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
    
     // Получаем локальные компоненты даты и времени
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`; // Формат для datetime-local
};

    // При изменении appointment обновляем state
    useEffect(() => {
        if (appointment) {
            setFormData({
                date: appointment.date || '',
                title: appointment.title || '',
                status: appointment.status || 'scheduled',
                description: appointment.description || '',
            });
        }
    }, [appointment]);

    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(appointment);
        closeModal();
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="date">
                <span>Date: </span>
                <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData.date ? formatDateForInput(formData.date) : ''}
                    onChange={handleInputChange}
                />
            </label>

            <label htmlFor="title">
                <span>Title: </span>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                />
            </label>

            <label htmlFor="status">
                <span>Status: </span>
                <select 
                    id="status" 
                    name="status" 
                    value={formData.status} 
                    onChange={handleInputChange}
                >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                </select>
            </label>

            <label htmlFor="description">
            <span>Description: </span>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
            </label>
            <div className={styles.formBtn}>
                <button type="submit">Save</button>
                <button type="button" onClick={closeModal}>Cancel</button>
            </div>            
        </form>
    );
}

export default AppointmentForm;
