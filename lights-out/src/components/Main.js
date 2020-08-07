import React from 'react';

import Stage from './Stage';
import Controle from './Controle';


class Main extends React.Component {
    render() {
        return (
            <div className='main'>
                <Stage />
                <Controle />
            </div>
        );
    }
}

export default Main;
