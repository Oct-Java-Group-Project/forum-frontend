import React, { useEffect, useState } from 'react';
import { fetchHistory } from "../services/historyService";
import { fetchPostDetails } from "../services/postService";
import Nav from "../components/Nav";
import Table from "../components/Table";
import Dialog from "../components/Dialog";
import { useAuth } from "../contexts/AuthContext";

const History = () => {
    const [historyData, setHistoryData] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { authstate } = useAuth();

    useEffect(() => {
        const getHistory = async () => {
            if (authstate.user && authstate.user.userid) {
                setLoading(true);
                try {
                    const data = await fetchHistory(authstate.user.userid);
                    console.log('Fetched history data:', data);
                    // Ensure data is in the correct format
                    if (Array.isArray(data)) {
                        setHistoryData(data);
                    }
                } catch (err) {
                    console.error('Error fetching history:', err);
                } finally {
                    setLoading(false);
                }
            }
        };
        getHistory();
    }, [authstate.user]);

    const onPost = async (postId) => {
        try {
            const postDetails = await fetchPostDetails(postId);
            if (postDetails) {
                setSelectedPost(postDetails);
                setDialog(true);
            }
        } catch (err) {
            console.error('Error fetching post details:', err);
        }
    };

    const headers = ['ID', 'Title', 'Author', 'View Date'];

    if (loading) {
        return (
            <div className="container">
                <Nav />
                <main className="main">
                    <div className="table">
                        <p style={{ padding: '20px', textAlign: 'center' }}>Loading history...</p>
                    </div>
                    <div className="stats">
                        <h3>Welcome, {authstate.user.firstname} {authstate.user.lastname}</h3>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="container">
            <Nav />
            <main className="main">
                <div className="table">
                    <Table
                        headers={headers}
                        initdata={historyData}
                        activetab="History"
                    />
                </div>
                <div className="stats">
                    <h3>Welcome, {authstate.user.firstname} {authstate.user.lastname}</h3>
                </div>
            </main>
            {selectedPost && (
                <Dialog
                    isvisible={dialog}
                    onClose={() => {
                        setDialog(false);
                        setSelectedPost(null);
                    }}
                    postdetails={selectedPost}
                />
            )}
        </div>
    );
};

export default History;