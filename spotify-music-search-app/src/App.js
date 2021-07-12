import {useState, useEffect} from 'react';
import './App.css';
import Login from './components/Login.js';
import Main from './components/Main.js';
import { getTokenFromUrl } from './components/Spotify';


function App() {
    let [token, setToken] = useState(null);
    useEffect(() => {
        const hash = getTokenFromUrl();
        window.location.hash = "";
        let access_token = hash.access_token;
        let local_token = localStorage.getItem('access_token');
        if (!access_token && !!local_token) {
            access_token = local_token
        }
        if (access_token) {
            setToken(access_token)
            localStorage.setItem('access_token', access_token);
        }
    }, [])
    return (
        <div className="App">
            {token ? <Main token={token}/> : <Login />}
        </div>
    );
}

export default App;
