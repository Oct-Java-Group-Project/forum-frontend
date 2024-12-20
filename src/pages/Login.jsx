import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './form.css';
import { useAuth } from "../contexts/AuthContext";


function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();
    const [credentials, setcredentials] = useState({ username: '', password: '', });
    const [error, setError] = useState('');

    const onLogin = async (e) => {
        e.preventDefault();
        try {
            // API call to verify user credentials via API Gateway
            const response = await fetch("http://localhost:8080/auth/login", { // Replace with the Gateway endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Invalid username or password");
            }

            const data = await response.json();
            console.log("API Response:", data);

            // Proceed with login logic if API call is successful
            login(data); // Pass the API response to the login context
            navigate('/home');
        } catch (err) {
            console.error("Login error:", err.message);
            setError(err.message);
        }
    };
    return (
        <div className="background">
            <div className="formcontainer">
            <form onSubmit={onLogin} className="card">
                <h3>Login</h3>
                {error && <div style={{ color: "red" }}>{error}</div>}
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" value={credentials.username} onChange={(e)=>setcredentials({...credentials,username:e.target.value})} required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" value={credentials.password} onChange={(e) => setcredentials({...credentials,password:e.target.value})} required />
                </div>
                <div className="button">
                    <button type="submit">Login</button>
                    <div className="links">
                        <a href="#">Forgot Password?</a>
                        <a href="/register">Register</a>
                        <a onClick={()=>navigate('/message')}>Contact Us</a>
                    </div>
                </div>
            </form>
        </div>
        </div>
    )
}
export default Login;