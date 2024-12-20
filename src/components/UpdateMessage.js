import React, { useState } from 'react';

const UpdateMessage = ({ message, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ ...message });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h3>Update Message</h3>

            <div>
                <label>Subject:</label>
                <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    disabled
                />
            </div>

            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                />
            </div>

            <div>
                <label>Message:</label>
                <textarea
                    name="message"
                    value={formData.message}
                    disabled
                />
            </div>

            <div>
                <label>Status:</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="RESOLVED">RESOLVED</option>
                </select>
            </div>

            <div className="button">
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    );
};

export default UpdateMessage;