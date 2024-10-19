// src/pages/LandingPage.js
import React from 'react';
import Header from '../Header';
import '../App.css'; // Optional CSS for styling


export default function LandingPage() {
    return (
        <div className="landing-page">
            <div className="landing-content">
                <div className="gifs">
                    <div className="gif-container">
                        <img src="/Welcome.gif" alt="welcome" />      
                    </div>
                    <div className="gif-container">
                        <img src="/RegisterNow.gif" alt="register" />
                    </div>
                    <div className="gif-container">
                        <img src="/features.gif" alt="Gif 3" />
                    </div>
                </div>
            </div>
        </div>
    );
}


