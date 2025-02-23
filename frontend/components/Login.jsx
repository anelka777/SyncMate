import { useState } from "react";

function Login({ handleSuccess, closeModal }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    /*
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Очищаем старую ошибку
        
        try {
        const response = await fetch('http://localhost:3000/api/v1/auth/login', {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
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
*/
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Очищаем старую ошибку
    
    if (!isValidEmail(email)) {
        setError("Invalid email format");
        return; // Останавливаем отправку формы, если email некорректный
    }

    try {
        const response = await fetch('http://localhost:3000/api/v1/auth/login', {
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



