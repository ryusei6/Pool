import React from 'react';
import {accessUrl} from "./Spotify";

function Login() {
    return (
        <div className='Login'>
            <h2>spotifyへログインしてください。</h2>
            <a href={accessUrl} style={{color: 'white'}}>ログイン</a>
        </div>
    )
}

export default Login;

