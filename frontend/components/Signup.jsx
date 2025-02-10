
import { useState } from 'react';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (data.token) {
        localStorage.setItem('token', data.token); // Сохранение токена в localStorage
        alert('Registration successful');
        } else {
        alert('Error: ' + data.msg);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="modalForm">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="modalInput"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="modalInput"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="modalInput"
                />
                <button type="submit" className="modalButton">Register</button>
            </form>
            </div>
        );
}

export default Register;
