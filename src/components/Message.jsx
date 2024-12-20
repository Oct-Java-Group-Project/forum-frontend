import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import '../pages/form.css';
import './message.css';
import axios from "axios";

function Message() {
    const navigate = useNavigate();
    const { authstate } = useAuth();
    const [subject, setsubject] = useState('');
    const [email, setemail] = useState(authstate.user ? authstate.user.email : '');
    const [msg, setmsg] = useState('');

    const onSend = async(e) => {
        e.preventDefault();
        const messagedata = {
            userId: authstate.user ? authstate.user.userid : 0, // 为未登录用户提供默认值
            subject,
            email,
            message: msg,
        };

        try {
            const res = await axios.post('http://localhost:8080/messages', messagedata, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.status === 200 || res.status === 201) {
                alert('Message sent successfully!');
                if (!authstate.user) {
                    navigate('/');
                } else {
                    navigate('/home');
                }
            } else {
                throw new Error('Unexpected response status');
            }
        } catch(err) {
            console.error('Error sending message:', err);
            let errorMessage = 'There was a problem sending your message.';
            if (err.response) {
                errorMessage = err.response.data?.message || errorMessage;
            }
            alert(errorMessage);
            if (!authstate.user) {
                navigate('/');
            }
        }
    }

    return (
        <div className="formcontainer">
            <form onSubmit={onSend} className={`contactuscard ${!authstate.user ? 'topmargin' : ''}`}>
                <h3>Contact Us</h3>
                <div>
                    <label htmlFor="subject">Subject</label>
                    <input type="text" value={subject} onChange={(e) => setsubject(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" value={email} onChange={(e) => setemail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="msg">Message</label>
                    <textarea value={msg} onChange={(e) => setmsg(e.target.value)} required />
                </div>

                <div className="button">
                    <button type="submit">Submit</button>
                    <div className="links">
                        {authstate.isauthenticated && <a onClick={() => navigate('/home')}>We will get back to you soon!</a>}
                        {!authstate.isauthenticated && <a href="/">Back to Login</a>}
                    </div>
                </div>
            </form>
        </div>
    );
}
export default Message;