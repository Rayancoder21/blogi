import { useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";


export default function Header() {
    const {setUserInfo, userInfo} = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        }).then(response => {
            if (response.ok) {
            response.json().then(userInfo => {
            setUserInfo(userInfo);
        })
    }
    });
    }, []);

    function logout() {
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        }).then(() => {
        setUserInfo(null);
        // Redirect to landing page
        window.location.href = '/';  // Redirect to landing page
        });
    }

    const username = userInfo?.username;

    return(
        <header>
            <Link to="/" className="logo">Blogi</Link>
            <nav>
                {username && (
                    <> 
                    <Link to="/create">Create new post</Link>
                    <a onClick={logout}>Logout ({username})</a>
                    </>
                )}
                {!username && (
                    <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                    </>
                    )}              
            </nav>
        </header>
        );
}