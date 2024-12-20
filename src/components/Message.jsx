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
        // api call - send message
        const messagedata={
            subject,
            email,
            message:msg,
        };
        try{
            const res=await axios.post('http://localhost:8080/messages',messagedata,{
                headers:{
                    'Content-Type':'application/json',
                },
            });
            if (res.status===200){
                alert('message sent!');
                if(!authstate.user){
                    navigate('/');
                }else{
                    navigate('/home');
                }
            }else{
                alert('can not send message right now...');
            }
        }catch(err){
            alert('problem with message transit...');
            navigate('/');
            console.error(err);
        }
    }
    return (
        <div className="formcontainer">
            <form onSubmit={onSend} className={`contactuscard ${!authstate.user?'topmargin':''}`}>
                <h3>Contact Us</h3>
                <div>
                    <label htmlFor="subject">Subject</label>
                    <input type="text" value={subject} onChange={(e) => setsubject(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" value={email} onChange={(e) => setemail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="msg">Message</label>
                    <textarea value={msg} onChange={(e) => setmsg(e.target.value)} required />
                </div>

                <div className="button">
                    <button type="submit">Submit</button>
                    <div className="links">
                        {authstate.isauthenticated && <a onClick={()=>navigate('/home')}>We will get back to you soon!</a>}
                        {!authstate.isauthenticated && <a href="/">Back to Login</a>}
                    </div>
                </div>
            </form>

        </div>


    );
}
export default Message;