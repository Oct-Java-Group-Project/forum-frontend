// import { Navigate, useNavigate } from 'react-router-dom';
import Table from "../components/Table";
import { useAuth } from "../contexts/AuthContext";
import './home.css';
import Nav from '../components/Nav';
import { useEffect, useState } from 'react';
import { fetchPosts } from "../services/postService";

function Home() {
    const { authstate } = useAuth();
    // deleted or all posts
    const [activetab, setactivetab] = useState('All');
    const [activetabdata, setactivetabdata] = useState([]);

    // retrieve data from service
    const [data,setdata]=useState([]);
    const [admindata,setadmindata]=useState([]);
    const [deleteddata,setdeleteddata]=useState([]);
    useEffect(()=>{
        const getPosts=async()=>{
            const {data,admindata,deleteddata}=await fetchPosts();
            setdata(data);
            setadmindata(admindata);
            setdeleteddata(deleteddata);
        };
        getPosts();
    },[]);
    // for admin home page: all and list of deleted posts
    const setTabData = () => {
        switch (activetab) {
            case 'All':setactivetabdata(data);break;
            case 'Deleted':setactivetabdata(deleteddata);break;
            default: setactivetabdata(data);break;
        }
    }
    useEffect(() => {
        setTabData();
    }, [activetab]);

    // admin data and user data
    const headers = ['ID','Title', 'Author', 'Date'];
    const adminheaders=['ID','Title','Author','Date','Status'];
    const tabs=['All', 'Deleted'];
    return (
        <div className="container">
            <Nav/>
            <main className="main">

            
                <div className="table">
                    {
                        authstate.user.isadmin&&<div className='tabs'>
                            {tabs.map((tab, idx)=><a key={idx} onClick={()=>{setactivetab(tab);setTabData()}} className={`tab ${activetab === tab ? 'activetab' : ''}`}>{tab}</a>)}
                        </div>
                    }

                    <Table headers={authstate.user.isadmin?activetab==='All'?adminheaders:headers:headers} initdata={authstate.user.isadmin?activetab==='All'?admindata:deleteddata:data} activetab={activetab}/>
                </div>
             
                
                <div className="stats">
                    <h3>Welcome, {authstate.user.firstname} {authstate.user.lastname}</h3>
                </div>
            </main>
        </div>
    )

}

export default Home;