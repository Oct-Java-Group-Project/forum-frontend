import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './form.css';
import axios from "axios";


function Register(){
    // const [username, setusername] = useState('');
    const [password, setpassword] = useState('');

    const [firstname,setfirstname]=useState('');
    const [lastname,setlastname]=useState('');
    const [email,setemail]=useState('');

    // const [error, setError] = useState('');

    const navigate = useNavigate();
    // selyn
    const register = async (e) => {
        e.preventDefault();
        const user={firstname,lastname,email,password};
        try{
            const res=await axios.post('http://localhost:8080/auth/register',user);
            if(res.status==200||res.status==201){
                alert("Confirm registration by email!");
                navigate('/');
            }
        }catch(err){
            console.log(err);
        }
        
        // try {
        //     // API call to register a new user
        //     const response = await fetch("http://localhost:8080/auth/register", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             password,
        //             firstName: firstname,
        //             lastName: lastname,
        //             email,
        //         }),
        //     });

        //     if (!response.ok) {
        //         const errorData = await response.json();
        //         throw new Error(errorData.message || "Registration failed");
        //     }

        //     const data = await response.json();
        //     console.log("Registration Successful:", data);
        //     // Navigate to the home page or login page after successful registration
        //     navigate('/login');
        // } catch (err) {
        //     console.error("Registration error:", err.message);
        //     setError(err.message);
        // }
    };
    return (
        <div className="formcontainer">
            <form onSubmit={register} className="card">
                <h3>Register</h3>


                <div>
                    <label htmlFor="firstname">First Name</label>
                    <input type="firstname" id="firstname" value={firstname} onChange={(e) => setfirstname(e.target.value)} required />
                </div>                
                <div>
                    <label htmlFor="lastname">Last Name</label>
                    <input type="lastname" id="lastname" value={lastname} onChange={(e) => setlastname(e.target.value)} required />
                </div>                
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setemail(e.target.value)} required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setpassword(e.target.value)} required />
                </div>
                <div className="button">
                    <button type="submit">Register</button>
                    <div className="links">
                        <a onClick={()=>navigate('/message')}>Contact Us</a>
                    </div>
                </div>
            </form>
        </div>
    );
}
export default Register;