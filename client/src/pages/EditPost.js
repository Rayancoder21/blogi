import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Editor from '../Editor';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';


export default function EditPost() {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch ('http://localhost:4000/post/'+id).then(response => {
            response.json().then(postInfo => {
                setTitle(postInfo.title);
                setSummary(postInfo.summary);
                setContent(postInfo.content);

            });
        });
    }, []);
    async function updatePost(ev) {
        ev.preventDefault(); // Ensure this is at the top of the function
    
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files[0]); // Ensure you're getting the first file
        }
    
        try {
            const response = await fetch('http://localhost:4000/post', {
                method: 'PUT',
                body: data,
                credentials: 'include',
            });
    
            if (response.ok) {
                setRedirect(true);
            } else {
                console.error("Update Post failed:", response.statusText);
            }
        } catch (error) {
            console.error("Error during fetch:", error);
        }
    }    

    if (redirect) {
        return <Navigate to={"/post/"+id} />
    }

    return(
        <form onSubmit={updatePost}>
            <input type="title" 
                placeholder={'Title'} 
                value={title} 
                onChange={ev => setTitle(ev.target.value)}/>
            <input type="summary" 
                placeholder={'Summary'} 
                value={summary} 
                onChange={ev => setSummary(ev.target.value)}/>
            <input type="file"  
                onChange={ev => setFiles(ev.target.files)}/>
            <Editor value={content} onChange={setContent} />
            <button style={{marginTop:'5px'}}> Update Post</button>
        </form> 
    );
}