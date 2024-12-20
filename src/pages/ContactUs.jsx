import { useAuth } from "../contexts/AuthContext";
import './form.css';
import './contactus.css';
import Nav from "../components/Nav";
import Message from "../components/Message";

function ContactUs() {
    const { authstate } = useAuth();

    return (
        <div className="container">
            <Nav />
            <main className="main">
                <div className="table ">
                    <div className="contactbox">
                        <Message/>
                    </div>
                </div>

                <div className="stats">
                    <h3>Welcome, {authstate.user.firstname} {authstate.user.lastname}</h3>
                </div>
            </main>
        </div>
    );
}
export default ContactUs;