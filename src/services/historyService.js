import axios from "axios";

const URL = 'http://localhost:8080/history';

export const fetchHistory = async (userId) => {
    try {
        const res = await axios.get(`${URL}/user/${userId}`);
        console.log('History API Response:', res.data);

        const historyItems = res.data || [];
        console.log('History items before processing:', historyItems);

        if (!Array.isArray(historyItems) || historyItems.length === 0) {
            return [];
        }

        const formattedData = historyItems.map(item => [
            item.postId,
            item.postTitle || '',
            item.authorName || 'Unknown',
            new Date(item.viewDate).toLocaleDateString()  // View Date
        ]);

        console.log('Formatted history data:', formattedData);
        return formattedData;
    } catch (err) {
        console.error('Error fetching history:', err);
        return [];
    }
};

export const createHistory = async (userId, postId) => {
    try {
        const data = {
            userId: userId,
            postId: postId
        };
        await axios.post(URL, data);
    } catch (err) {
        console.error('Error creating history:', err);
    }
};