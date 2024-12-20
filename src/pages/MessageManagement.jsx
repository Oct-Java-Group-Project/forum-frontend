import React, { useEffect, useState } from 'react';
import { getMessages, updateMessage } from '../services/messageService';
import UpdateMessage from '../components/UpdateMessage';
import Nav from "../components/Nav";
import { useAuth } from "../contexts/AuthContext";

const MessageManagement = () => {
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingMessage, setEditingMessage] = useState(null);
    const { authstate } = useAuth();
    const messagesPerPage = 7;

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const data = await getMessages();
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const handleUpdateClick = (message) => {
        setEditingMessage(message);
    };

    const handleSaveUpdate = async (updatedMessage) => {
        try {
            await updateMessage(updatedMessage.messageId, updatedMessage);
            await fetchMessages();
            setEditingMessage(null);
        } catch (error) {
            console.error('Error saving update:', error);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(messages.length / messagesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

    return (
        <div className="container">
            <Nav />
            <main className="main">
                <div className="table">
                    {!editingMessage ? (
                        <>
                            <table>
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Subject</th>
                                    <th>Email</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentMessages.map((msg) => (
                                    <tr key={msg.messageId}>
                                        <td>{new Date(msg.dateCreated).toLocaleString()}</td>
                                        <td>{msg.subject}</td>
                                        <td>{msg.email}</td>
                                        <td>{msg.message}</td>
                                        <td className={msg.status === 'OPEN' ? 'green' : 'red'}>{msg.status}</td>
                                        <td>
                                            <button onClick={() => handleUpdateClick(msg)}>
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className="buttons" style={{ marginTop: '1em' }}>
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span style={{ margin: '0 1em' }}>
                                    Page {currentPage} of {Math.ceil(messages.length / messagesPerPage)}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage >= Math.ceil(messages.length / messagesPerPage)}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        <UpdateMessage
                            message={editingMessage}
                            onSave={handleSaveUpdate}
                            onCancel={() => setEditingMessage(null)}
                        />
                    )}
                </div>
                <div className="stats">
                    <h3>Welcome, {authstate.user.firstname} {authstate.user.lastname}</h3>
                </div>
            </main>
        </div>
    );
};

export default MessageManagement;