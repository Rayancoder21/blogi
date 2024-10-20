import React from 'react';
import '../App.css';


export default function LandingPage() {
    return (
        <div className="landing-page">
            <div className="landing-content">
                <div className="gifs">
                    <div className="gif-container">
                        <img src="/Welcome.gif" alt="welcome" />      
                    </div>
                    <div className="gif-container">
                        <img src="/register.gif" alt="register" />
                    </div>
                    <div className="gif-container">
                        <img src="/features.gif" alt="Gif 3" />
                    </div>
                </div>
            </div>
        </div>
    );
}


