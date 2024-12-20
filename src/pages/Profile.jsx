import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Table from "../components/Table";
import Nav from "../components/Nav";
import logo from '../logo.svg';
import './home.css';
import './profile.css';
import { useEffect, useState } from "react";
import { fetchUserPosts } from "../services/postService";
function Profile() {

    const { authstate } = useAuth();
    // const navigate=useNavigate();

    const [activetab, setactivetab] = useState('Published');
    const [activetabdata, setactivetabdata] = useState([]);

    // get user posts
    const [publisheddata,setpublisheddata]=useState([]);
    const [draftdata,setdraftdata]=useState([]);
    useEffect(()=>{
        const getUserPosts=async()=>{
            const {publisheddata,draftdata}=await fetchUserPosts(authstate.user.userid);
            setpublisheddata(publisheddata);
            setdraftdata(draftdata);
        };
        getUserPosts();
    },[]);
    const setTabData = () => {
        switch (activetab) {
            case 'Published':setactivetabdata(publisheddata);break;
            case 'Drafts':setactivetabdata(draftdata);break;
            default: setactivetabdata(publisheddata);break;
        }
    }

    useEffect(() => {
        setTabData();
    }, [activetab]);

    // if (!authstate.isauthenticated) {
    //     return <Navigate to="/" />
    // }


    const tabs = ['Published', 'Drafts', 'Hidden', 'Archived','History'];
    const publishedheaders = ['ID','Title', 'Date', 'Status', '\u{1F4E6}'];
    const draftheaders = ['ID','Title', 'Date'];


    // const publisheddata = [
    //     [1,'Easy Bread Pudding Recipe', '2024-12-15', 'Active', '\u{1F4E6}'],
    //     [2,'Zwilling Chopsticks', '2024-12-33', 'Active', '\u{1F4E6}'],
    //     [3,'Staub Macaroon Dinnerware', '2000-12-12', 'Inactive', '\u{1F4E6}'],
    //     [4,'Holiday Treats', '2020-12-12', 'Inactive', '\u{1F4E6}'],
    // ];
    // const draftdata = [
    //     [1,'Easy Bread Pudding Recipe', '2024-12-15'],
    //     [2,'Zwilling Chopsticks', '2024-12-33'],
    //     [3,'Staub Macaroon Dinnerware', '2000-12-12'],
    //     [4,'Holiday Treats', '2020-12-12'],
    // ];

    const getTabHeaders = () => {
        switch (activetab) {
            case 'Published': return publishedheaders;
            case 'Drafts': return draftheaders;
            default: return publishedheaders;
        }
    }


    return (
        <div className="container">
            <Nav />
            <main className="main">
                <div className="table">
                    <div className="tabs">
                        {tabs.map((tab, idx) => (
                            <a key={idx} className={`tab ${activetab === tab ? 'activetab' : ''} ${tab==='History'?'historytab':''}`} onClick={() => { setactivetab(tab);setTabData() }}>{tab}</a>
                        ))}
                    </div>
                    {activetabdata&&<Table headers={getTabHeaders()} initdata={activetabdata} isadmin={authstate.user.isadmin} />}
                </div>
                <div className="stats">
                    <div className="profile-userinfo">
                        <img src={logo} className="App-logo" alt="logo" id="profileimg"/>

                        <div className="userdetail">
                            <h3>{authstate.user.firstname} {authstate.user.lastname}</h3>
                            <p>{authstate.user.createdat}</p>
                        </div>
                        <div></div>
                    </div>
                    <hr></hr>
                    <div className="topposts">
                        <p>Popular Posts</p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Profile;