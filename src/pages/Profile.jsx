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
    const [hiddendata,sethiddendata]=useState([]);
    const [archiveddata,setarchiveddata]=useState([]);
    useEffect(()=>{
        const getUserPosts=async()=>{
            const {publisheddata,draftdata,hiddendata,archiveddata}=await fetchUserPosts(authstate.user.userid);
            setpublisheddata(publisheddata);
            setdraftdata(draftdata);
            sethiddendata(hiddendata);
            setarchiveddata(archiveddata);
        };
        getUserPosts();
    },[]);
    const setTabData = () => {
        switch (activetab) {
            case 'Published':setactivetabdata(publisheddata);break;
            case 'Drafts':setactivetabdata(draftdata);break;
            case 'Hidden':setactivetabdata(hiddendata);break;
            case 'Archived':setactivetabdata(archiveddata);break;
            default: setactivetabdata(publisheddata);break;
        }
    }

    useEffect(() => {
        setTabData();
    }, [activetab]);


    const tabs = ['Published', 'Drafts', 'Hidden', 'Archived','History'];
    const publishedheaders = ['ID','Title', 'Date', 'Status', '\u{1F4E6}'];
    const draftheaders = ['ID','Title', 'Date'];

    const getTabHeaders = () => {
        switch (activetab) {
            case 'Published': return publishedheaders;
            case 'Drafts': return draftheaders;
            case 'Hidden': return draftheaders;
            case 'Archived': return draftheaders;
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