import React, { useState, useEffect } from 'react';
import styles from "./Dashboard.module.css";

function Dashboard() {



    return (
        <div className={styles.dashContainer}>
            <div className={styles.dashWorkingTable}>
                <h2>Your dashboard</h2>
                <div className={styles.appointmentSample}></div>
            </div>
        </div>
    );
}

export default Dashboard;
