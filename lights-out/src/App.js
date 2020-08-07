import React from 'react';
import './App.css';
import Header from './components/Header.js';
import Footer from './components/Footer';
import Main from './components/Main.js'

function App() {
    return (
        <div className='app'>
            <Header />
            <Main />
            <Footer />
        </div>
    );
}

export default App;
