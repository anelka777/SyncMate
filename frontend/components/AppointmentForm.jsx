import React, { useState } from 'react';
import styles from './AppointmentForm.module.css';

function AppointmentForm({ onSubmit, closeModal }) {
    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('scheduled');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const appointmentData = { date, title, status, description };

        onSubmit(appointmentData);

        // Очищаем форму после отправки
        setDate('');
        setTitle('');
        setStatus('scheduled');
        setDescription('');

        closeModal();
    };

    return (
        <div className={styles.createAppModal}>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Date: </span>
                    <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <span>Title: </span>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Appointment Title"
                        required
                    />
                </label>
                <label>
                    <span>Status: </span>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </label>
                <label>
                    <span>Description: </span>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        rows="3"
                    />
                </label>
                <div className={styles.formBtn}>
                    <button type="submit">Create</button>
                    <button type="button" onClick={closeModal}>Close</button>
                </div>
            </form>
        </div>
    );
}

export default AppointmentForm;