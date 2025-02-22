import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import styles from "./WeekViewChart.module.css"

const WeekViewChart = ({ appointments }) => {
    // Функция для группировки записей по дням недели начиная с сегодняшнего дня
    const getAppointmentsByDay = () => {
        const today = new Date();
        const weekDays = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + i); // Получаем даты начиная с сегодняшнего дня (плюс 0 для сегодня, 1 для завтра и так далее)

            const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
            const dateString = date.toLocaleDateString("en-US"); // Получаем полную дату
            return { day: `${dayOfWeek} ${dateString}`, count: 0 };
        });

        // Группируем записи по дням недели
        appointments.forEach((appointment) => {
            const appointmentDate = new Date(appointment.date);
            const dayIndex = appointmentDate.getDate() - today.getDate(); // Рассчитываем смещение с сегодняшнего дня
            if (dayIndex >= 0 && dayIndex < 7) { // Если день в пределах 7 дней начиная с сегодня
                weekDays[dayIndex].count += 1;
            }
        });

        return weekDays;
    };

    const data = getAppointmentsByDay();

    return (
        <div className={styles.chartContainer}>
            <h2 className={styles.chartTitle}>Week Overview</h2>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                    <XAxis dataKey="day" stroke="black" />
                    <YAxis allowDecimals={false} stroke="black" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00bfa6" barSize={15} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeekViewChart;