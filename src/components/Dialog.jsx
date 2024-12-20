import './dialog.css';
import logo from '../logo.svg';
import { useState } from 'react';

// postdetails: for displaying post details
// isnewpost,onPostSubmit: for creating new posts
function Dialog({ isvisible, onClose, postdetails,isnewpost,onPostSubmit}) {
    const [title,settitle]=useState('');
    const [content,setcontent]=useState('');
    if (!isvisible) return null;


    if(isnewpost){

        const publishpost=()=>{
            onPostSubmit({title,content});;
            onClose();
        };
        const savepost=()=>{
            onPostSubmit({title,content});;
            onClose();
        };

        return(
            <>
            <div className="overlay" onClick={onClose}></div>
            <div className="dialog">
                <button className="exit" onClick={onClose}>X</button>
                <div className='dialoginfo'>
                    <img src={logo} className="App-logo" alt="logo" id='dialogprofileimg' />
                    {/* <p>Author: {postdetails.author}</p> */}
                </div>
                <div className='dialogheaderinput'>
                        <input type='text' placeholder='Title' value={title} onChange={(e)=>settitle(e.target.value)}/>
  
                    {/* <hr className='divide'></hr> */}
                    
                </div>


                {/* <hr className='divide'></hr> */}
                <div className='dialogcontent-wrapper'>
                <textarea className="dialogcontentinput" placeholder='Content' value={content} onChange={(e)=>setcontent(e.target.value)}/>
                </div>
                <div>
                <button onClick={savepost}>Save</button>
                <button onClick={publishpost}>Publish</button>
                </div>
       

                <hr className='divide'></hr>

            </div>
        </>
        );
    };
    return (
        <>
            <div className="overlay" onClick={onClose}></div>
            <div className="dialog">
                <button className="exit" onClick={onClose}>X</button>

                <div className='dialogheader'>
                    <h2>{postdetails.title}</h2>
                    <div className='dialogdescription'>
                        <p>views: {postdetails.views}</p>
                        <p>likes: {postdetails.likes}</p>
                        <p>replies: {postdetails.totalreplies}</p>
                    </div>
                    <hr className='divide'></hr>
                </div>

                <div className='dialoginfo'>
                    <img src={logo} className="App-logo" alt="logo" id='dialogprofileimg' />
                    <p>Author: {postdetails.author}</p>
                    <p>Created: {postdetails.createdat}</p>
                    <p>Updated: {postdetails.updatedat}</p>
                </div>
                {/* <hr className='divide'></hr> */}
                <div className='dialogcontent-wrapper'>
                <p className='dialogcontent'>{postdetails.content}... Here is some additional filler text to make the user interface look better because currently the post is only one sentence and an actual post would be much longer than that. This is part of the nested flexbox dialogcontent-wrapper which is part of the nested flexbox dialog-body and part of the flexbox dialog. All properties are of border box so margins and paddings appear within the content area and it is easier to style the content on the page.</p>
                </div>

                <hr className='divide'></hr>
                <div>
                    {postdetails.replies && postdetails.replies.length > 0 ? (
                        <ul>
                            {postdetails.replies.map((reply, idx) => (
                                <li key={idx} className='postreplies'>
                                    <p>{reply.comment}</p>
                                    <ul>
                                        {Array.isArray(reply.subreplies)&&reply.subreplies.map((subreply, subidx) => (
                                            <li key={subidx}>{subreply.comment}</li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No replies yet...</p>
                    )}
                </div>

            </div>
        </>
    )
}
export default Dialog;