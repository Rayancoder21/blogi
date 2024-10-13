import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function PostPage() {
    const {id} = useParams();
    const [postInfo, setPostInfo] = useState({});
    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
            });
        });
    }, []);

    if (!postInfo) return '';

    return (
        <div className="post-page">  
            <h1>{postInfo.title}</h1>        
            <div className="image">          
                <img src={`http://localhost:4000/${postInfo.cover}`} alt="cover image" />
            </div>
            <div dangerouslySetInnerHTML={{__html:postInfo.content}}/>
        </div>
    );

}