import { useState } from "react";

function Login({ handleSuccess, closeModal }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;



const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!isValidEmail(email)) {
        setError("Invalid email format");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Login failed");
        }

        const data = await response.json();
        const token = data.token;
        const user = data.user; 
        if (token && user && user.name) {
            localStorage.setItem("token", token);
            localStorage.setItem("userName", user.name);
            handleSuccess(data);
        } else {
            setError("No token received");
        }
    } catch (err) {
        setError("Login failed");
    }
};


    return(    
        <div className="modalBox">
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
                {error && <p className="error">{error}</p>}
                <button type="submit" className="modalButton">Login</button>
            </form>
        </div>        
    );
}

export default Login;



