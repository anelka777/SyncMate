import React, { useState, useEffect } from 'react';
import styles from './AppointmentForm.module.css';

function AppointmentForm({ onSubmit, closeModal, className, appointment }) {
    // Локальное состояние с инициализацией от appointment
    const [formData, setFormData] = useState({
        date: '',
        title: '',
        status: 'scheduled',
        description: '',
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        closeModal();
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            <label htmlFor="date">Date</label>
            <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
            />

            <label htmlFor="title">Title</label>
            <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
            />
            
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleInputChange}>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
            </select>

            <label htmlFor="description">Description</label>
            <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
            />

            <button type="submit">Save</button>
            <button type="button" onClick={closeModal}>Cancel</button>
        </form>
    );
}

export default AppointmentForm;