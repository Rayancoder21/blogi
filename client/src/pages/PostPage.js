import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { formatISO9075 } from "date-fns";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

export default function PostPage() {
    const {id} = useParams();
    const [postInfo, setPostInfo] = useState();
    const {userInfo} = useContext(UserContext);
    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
            });
        });
    }, [id]);

    async function deletePost() {
        if (window.confirm("Are you sure you want to delete this post?")) {
            const response = await fetch(`http://localhost:4000/post/${postInfo._id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
    
            if (response.ok) {
                // Redirect to the homepage or update state after deletion
                // You could also use Navigate from react-router to redirect
                // Example: Navigate to home page
                window.location.href = "/post";
            } else {
                alert("Failed to delete the post");
            }
        }
    }
    

    if (!postInfo) return '';

    return (
        <div className="post-page">  
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">by @{postInfo.author.username}</div>
            {userInfo.id === postInfo.author._id && (
                <div className="edit-row">
                    <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                        Edit Post
                    </Link>
                    <button className="delete-btn" onClick={deletePost}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>

                        Delete Post
                    </button>
                    </div>
            )}
            <div className="image">          
                <img src={`http://localhost:4000/${postInfo.cover}`} alt="" />
            </div>
            <div className="content" dangerouslySetInnerHTML={{__html:postInfo.content}}/>
        </div>
    );

}