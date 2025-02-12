import { useState } from "react";
import styles from "./Login.module.css";

function Login({ handleSuccess, closeModal }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const response = await fetch('http://localhost:3000/api/v1/auth/login', {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        const data = await response.json();
        const token = data.token;
        const user = data.user; //NAME
        if (token && user && user.name) { //NAME
            localStorage.setItem("token", token);
            localStorage.setItem("userName", user.name); //NAME
            handleSuccess(data); //NAME
        } else {
            setError("No token received");
        }
        } catch (err) {
            setError("Login failed");
        }
    };

    return(    
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="modalForm">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="modalInput"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="modalInput"
                />
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className="modalButton">Login</button>
            </form>
            {/* <button onClick={closeModal} className="modalCloseButton">Close</button> */}
        </div>        
    );
}

export default Login;



