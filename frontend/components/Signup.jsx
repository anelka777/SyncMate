
import { useState } from 'react';

function Register( {closeModal}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailPattern.test(email)) {   /*NEW*/
            setError('Please enter a valid email address');
            return; // Останавливаем отправку формы
        }

        setError('');

        const response = await fetch('http://localhost:3000/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token); 
            alert('Registration successful');
            closeModal();
        } else {
            alert('Error: ' + data.msg);
        }
    };

    return (
        <div className="modalBox">
            <h2>Sign up</h2>
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
                {error && <div className="error">{error}</div>}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="modalInput"
                />
                <button type="submit" className="modalButton">Sign up</button>
            </form>
        </div>
    );
}

export default Register;
