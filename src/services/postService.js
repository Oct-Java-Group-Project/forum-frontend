//api calls for managing posts

import axios from "axios";

const URL='http://localhost:8080/posts';
export const fetchPosts = async () => {
    try {
        console.log("enter axios get");
        const res = await axios.get('http://localhost:8080/posts');
        console.log("pass axios get");
        const deletedres=await axios.get('http://localhost:8080/posts/accessibility/deleted');
        console.log("pass axios get delete");
        // if (res.data.success) {
        const posts = res.data.success?res.data.data:_data;
        const deletedposts=deletedres.data.success?deletedres.data.data:_deleteddata;
        
        // id, title, author, date
        // const data = posts.map((post) => [
        //     post.postId, post.title, post.userId, new Date(post.metadata.createdAt).toLocaleDateString(),
        // ]);
        const data = posts.map((post) => [ post.post.postId, post.post.title, post.post.userId, post.post.metadata && post.post.metadata.createdAt ? new Date(post.post.metadata.createdAt).toLocaleDateString() : 'N/A', ])
        console.log(data);
        // id, title, author, date, status
        // const admindata = posts.map((post) => [
        //     post.postId, post.title, post.userId, new Date(post.metadata.createdAt).toLocaleDateString(), post.accessibility === 'PUBLISHED' ? 'Active' : 'Inactive',
        // ]);
        const admindata = posts.map((post) => [ post.post.postId, post.post.title, post.post.userId, post.post.metadata && post.post.metadata.createdAt ? new Date(post.post.metadata.createdAt).toLocaleDateString() : 'N/A',
            post.accessibility === 'PUBLISHED' ? 'Active' : 'Inactive', ]);
        // id,title,author,date
        // No nested post for this API call
        const deleteddata = deletedposts.map((post) => [
            post.postId, post.title, post.userId, new Date(post.metadata.createdAt).toLocaleDateString(),
        ])

        return { data, admindata ,deleteddata};
        // }
        // return { data: _data, admindata: _admindata };
    } catch (err) {
        console.log(err);
        return { data: _data, admindata: _admindata,deleteddata:_deleteddata };
    }
};
// export const fetchPostDetails=async(postid)=>{
//     try{
//         const res=await axios.get(`${URL}/posts/${postid}`);
//         console.log(res.data);
//         const post=res.data.success?res.data.data:[];
//         const postdetails={
//             title:post.title,
//             author:post.userId,
//             createdat:new Date(post.metadata.createdAt).toLocaleDateString(),
//             updatedat:new Date(post.metadata.updatedat).toLocaleDateString(),
//             content:post.content,
//             replies:[{userid:post.postReplies.userid,comment:post.postReplies.comment,
//                 subreplies:[
//                     {userid:post.postReplies.subReplies.userid,comment:post.postReplies.subReplies.comment},
//                 ]
//             }],
//         }
//         return postdetails;

//     }catch(err){
//         console.log(err);
//         return null;
//     }
// };
export const fetchPostDetails = async (postid) => {
    try {
        console.log("postid",postid);
        const res = await axios.get(`${URL}/${postid}`);
        console.log(res.data);

        if (res.data.success) {
            const post = res.data.data;

            const postdetails = {
                title: post.title,
                author: post.userId,
                createdat: new Date(post.metadata.createdAt).toLocaleDateString(),
                updatedat: new Date(post.metadata.updatedAt).toLocaleDateString(),
                views: post.metadata.views,
                likes: post.metadata.likes,
                totalreplies: post.metadata.totalReplies,
                content: post.content,
                replies: post.postReplies ? post.postReplies.map(reply => ({
                    userId: reply.userId,
                    comment: reply.comment,
                    subReplies: reply.subReplies ? reply.subReplies.map(subReply => ({
                        userId: subReply.userId,
                        comment: subReply.comment
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
const _data = [
    [1, 'Easy Bread Pudding Recipe', 'win', '2024-12-15'],
    [2, 'Zwilling Chopsticks', 'win', '2024-12-33'],
    [3, 'Staub Macaroon Dinnerware', 'seabass', '2000-12-12'],
    [4, 'Holiday Treats', 'seabass', '2020-12-12'],
];
// status: ban, unban
const _admindata = [
    [1, 'Easy Bread Pudding Recipe', 'win', '2024-12-15', 'Active'],
    [2, 'Zwilling Chopsticks', 'win', '2024-12-33', 'Inactive'],
    [3, 'Staub Macaroon Dinnerware', 'seabass', '2000-12-12', 'Active'],
    [4, 'Holiday Treats', 'seabass', '2020-12-12', 'Inactive'],
];
// admin tabs: for deleted posts
const _deleteddata = [
    [1, 'Easy Bread Pudding Recipe', 'win', '2024-12-15'],
    [2, 'Zwilling Chopsticks', 'win', '2024-12-33',],
    [3, 'Staub Macaroon Dinnerware', 'seabass', '2000-12-12'],
];