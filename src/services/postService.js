//api calls for managing posts

import axios from "axios";
import { capitalize } from "../utils/helpers";
import { useAuth } from "../contexts/AuthContext";
import { fetchHistory } from "./historyService";

const URL = 'http://localhost:8080/posts';
export const fetchPosts = async () => {
    try {
        const res = await axios.get(URL);
        const deletedres = await axios.get(`${URL}/accessibility/deleted`);

        console.log('API Response:', res.data);

        const posts = res.data.success ?
            (Array.isArray(res.data.data) ? res.data.data : [res.data.data]) : [];
        const deletedposts = deletedres.data.success ?
            (Array.isArray(deletedres.data.data) ? deletedres.data.data : [deletedres.data.data]) : [];

        // Add null checks and default values for posts
        const data = posts.map((post) => {
            const postData = post.post || post;
            const userData = post.user || {};
            return [
                postData.postId || '',
                postData.title || '',
                `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Unknown User',
                (postData.metadata?.createdAt) ?
                    new Date(postData.metadata.createdAt).toLocaleDateString() : 'N/A',
            ];
        });

        // Add null checks for admindata
        const admindata = posts
            .filter((post) => {
                const postData = post.post || post;
                const accessibility = postData.accessibility;
                return accessibility && accessibility !== 'UNPUBLISHED' && accessibility !== 'HIDDEN';
            })
            .map((post) => {
                const postData = post.post || post;
                const userData = post.user || {};
                return [
                    postData.postId || '',
                    postData.title || '',
                    `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Unknown User',
                    (postData.metadata?.createdAt) ?
                        new Date(postData.metadata.createdAt).toLocaleDateString() : 'N/A',
                    capitalize(postData.accessibility || 'N/A'),
                ];
            });

        // Add null checks for deleteddata
        const deleteddata = deletedposts.map((post) => {
            const postData = post.post || post;
            const userData = post.user || {};
            return [
                postData.postId || '',
                postData.title || '',
                `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Unknown User',
                (postData.metadata?.createdAt) ?
                    new Date(postData.metadata.createdAt).toLocaleDateString() : 'N/A',
            ];
        });

        return { data, admindata, deleteddata };
    } catch (err) {
        console.error('Error fetching posts:', err);
        return { data: [], admindata: [], deleteddata: [] };
    }
};

export const fetchPostDetails = async (postid) => {
    try {
        const res = await axios.get(`${URL}/${postid}`);
        // console.log('Post details response:', res.data);

        if (res.data.success) {
            const postData = res.data.data.post || res.data.data;
            const userData = res.data.data.user || {};

            const postdetails = {
                title: postData.title || '',
                author: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Unknown User',
                createdat: postData.metadata?.createdAt ?
                    new Date(postData.metadata.createdAt).toLocaleDateString() : 'N/A',
                updatedat: postData.metadata?.updatedAt ?
                    new Date(postData.metadata.updatedAt).toLocaleDateString() : 'N/A',
                views: postData.metadata?.views || 0,
                likes: postData.metadata?.likes || 0,
                totalreplies: postData.postReplies?.length || 0,
                content: postData.content || '',
                replies: postData.postReplies ? postData.postReplies.map(reply => ({
                    userId: reply.userId || '',
                    comment: reply.comment || '',
                    subReplies: reply.subReplies ? reply.subReplies.map(subReply => ({
                        userId: subReply.userId || '',
                        comment: subReply.comment || ''
                    })) : []
                })) : []
            };

            return postdetails;
        } else {
            console.warn("Response was not successful:", res.data.message);
            return null;
        }

    } catch (err) {
        console.warn("error fetching post details:", err);
        return null;
    }
};
export const fetchUserPosts = async (userid) => {

    try {
        const res = await axios.get(URL);

        const posts = res.data.success ?
            (Array.isArray(res.data.data) ? res.data.data : [res.data.data]) : [];

        // title, date, status, archived
        const publisheddata = posts.filter((post) => {
            const postData = post.post || post;
            // fetch user, published
            return postData.userId === userid && postData.accessibility === 'PUBLISHED';
        }).map((post) => {
            const postData = post.post || post;
            console.log('published user data', postData);
            const createdat = postData.metadata ? new Date(postData.metadata.createdAt).toLocaleDateString() : '';
            return [
                postData.postId || '',
                postData.title || '',
                createdat,
                postData.accessibility,
                postData.archived ? 'Archived' : 'Active',
            ];
        });
        const draftdata = posts.filter((post) => {
            const postData = post.post || post;
            // fetch user, published
            return postData.userId === userid && postData.accessibility === 'UNPUBLISHED';
        }).map((post) => {
            const postData = post.post || post;
            const createdat = postData.metadata ? new Date(postData.metadata.createdAt).toLocaleDateString() : '';
            return [
                postData.postId || '',
                postData.title || '',
                createdat,
            ];
        });
        const hiddendata = posts.filter((post) => {
            const postData = post.post || post;
            // fetch user, published
            return postData.userId === userid && postData.accessibility === 'HIDDEN';
        }).map((post) => {
            const postData = post.post || post;
            const createdat = postData.metadata ? new Date(postData.metadata.createdAt).toLocaleDateString() : '';
            return [
                postData.postId || '',
                postData.title || '',
                createdat,
            ];
        });
        const archiveddata = posts.filter((post) => {
            const postData = post.post || post;
            // fetch user, published
            return postData.userId === userid && postData?.archived === true;
        }).map((post) => {
            const postData = post.post || post;
            const createdat = postData.metadata ? new Date(postData.metadata.createdAt).toLocaleDateString() : '';
            return [
                postData.postId || '',
                postData.title || '',
                createdat,
            ];
        });
        return { publisheddata, draftdata, hiddendata, archiveddata };
    } catch (err) {
        // alert('we could not fetch your posts, please try again later...');
        console.error('Error fetching posts:', err);
        return { publisheddata: _publisheddata, draftdata: _draftdata, hiddendata: _draftdata, archiveddata: _draftdata };
    }
};

export const updatePost = async (postid, post) => {
    const postdetails = await fetchPostDetails(postid);
    if (!postdetails) {
        console.log('could not fetch post details to update post');
        return;
    }
    const postcontent = postdetails.content;
    post = { ...post, content: postcontent };

    try {
        const res = await axios.put(`${URL}/${postid}`, post);
    } catch (err) {
        alert('could not update post at this time...');
    }
};



const _publisheddata = [
    [1, 'Easy Bread Pudding Recipe', '2024-12-15', 'Active', '\u{1F4E6}'],
    [2, 'Zwilling Chopsticks', '2024-12-33', 'Active', '\u{1F4E6}'],
    [3, 'Staub Macaroon Dinnerware', '2000-12-12', 'Inactive', '\u{1F4E6}'],
    [4, 'Holiday Treats', '2020-12-12', 'Inactive', '\u{1F4E6}'],
];
const _draftdata = [
    [1, 'Easy Bread Pudding Recipe', '2024-12-15'],
    [2, 'Zwilling Chopsticks', '2024-12-33'],
    [3, 'Staub Macaroon Dinnerware', '2000-12-12'],
    [4, 'Holiday Treats', '2020-12-12'],
];
// Example test data - commented out for production
/*
const _data = [
    [1, 'Easy Bread Pudding Recipe', 'win', '2024-12-15'],
    [2, 'Zwilling Chopsticks', 'win', '2024-12-33'],
    [3, 'Staub Macaroon Dinnerware', 'seabass', '2000-12-12'],
    [4, 'Holiday Treats', 'seabass', '2020-12-12'],
];

const _admindata = [
    [1, 'Easy Bread Pudding Recipe', 'win', '2024-12-15', 'Active'],
    [2, 'Zwilling Chopsticks', 'win', '2024-12-33', 'Inactive'],
    [3, 'Staub Macaroon Dinnerware', 'seabass', '2000-12-12', 'Active'],
    [4, 'Holiday Treats', 'seabass', '2020-12-12', 'Inactive'],
];

const _deleteddata = [
    [1, 'Easy Bread Pudding Recipe', 'win', '2024-12-15'],
    [2, 'Zwilling Chopsticks', 'win', '2024-12-33'],
    [3, 'Staub Macaroon Dinnerware', 'seabass', '2000-12-12'],
];
*/