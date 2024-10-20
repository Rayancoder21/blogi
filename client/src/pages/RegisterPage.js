import { useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useContext } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(""); 
    const [redirect, setRedirect] = useState(false);
    const { setUserInfo } = useContext(UserContext);

    async function register(ev) {
        ev.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Clear error if passwords match
        setError("");
        
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });

        if (response.status === 200) {
            const userInfo = await response.json();
            setUserInfo(userInfo);
            setRedirect(true);
            alert('Registered successfully');
            
        } else {
            alert('You already have an account, please login');
        }
    }

    // Redirect if the user has successfully registered
    if (redirect) {
        return <Navigate to="/post" />; // Redirect to Post page after registration
    }

    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text" 
                placeholder="username" 
                value={username} 
                onChange={ev => setUsername(ev.target.value)}/>
            <input type="password" 
                placeholder="password" 
                value={password} 
                onChange={ev => setPassword(ev.target.value)}/>
                <input
                type="password"
                placeholder="confirm password" // Placeholder for confirm password
                value={confirmPassword}
                onChange={ev => setConfirmPassword(ev.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button>Register</button>
        </form>
    );
}
