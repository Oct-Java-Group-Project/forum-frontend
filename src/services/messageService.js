import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/messages';

export const getMessages = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

// Update a message
export const updateMessage = async (messageId, updatedMessage) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/${messageId}`, updatedMessage);
        return response.data; // Return updated message
    } catch (error) {
        console.error('Error updating message:', error);
        throw error;
    }
};

export const createMessage = async (messageData) => {
    try {
        const response = await axios.post(API_BASE_URL, messageData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to send message');
    }
};