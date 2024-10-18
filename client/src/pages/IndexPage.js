import Post from "../Post";
import { useEffect } from "react";
import { useState } from "react";


export default function IndexPage() {
    const[posts, setPosts] = useState([]);
    useEffect(() => {
        fetch('http://localhost:4000/post').then(response => {
            response.json().then(posts => {
                console.log(posts);
                setPosts(posts);
            });
        });
    }, []);
    return(
        <div> 
            {posts.length > 0 && posts.map(post => (
                <Post key={post._id} {...post} /> // Use post._id as the key
            ))}
        
        </div>
    );
}