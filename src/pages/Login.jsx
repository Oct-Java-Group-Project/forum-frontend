import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './form.css';
import { useAuth } from "../contexts/AuthContext";


function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();
    const [credentials, setcredentials] = useState({ email: '', password: '', });
    const onLogin = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
            navigate('/home');
        } catch (err) {
            console.error('Login failed:', err);
        }
    }
    return (
        <div className="formcontainer">
            <form onSubmit={onLogin} className="card">
                <h3>Login</h3>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" value={credentials.email} onChange={(e)=>setcredentials({...credentials,email:e.target.value})} required />
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
    )
}
export default Login;