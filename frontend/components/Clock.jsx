import { useState, useEffect } from "react";
import styles from "./Clock.module.css";

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
        setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className={styles.clock}>
            <h2>Now</h2>
            <div className={styles.clockBox}>
                <p>{formatDate(time)}</p>
                <p>{formatTime(time)}</p>
            </div>
            
        </div>
    );
};

export default Clock;
