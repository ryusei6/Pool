import React from 'react';
import Button from '@material-ui/core/Button';

function Controle(props) {
    return (
        <div className='controle'>
            <div className='buttons'>
                <Button className='button' color="secondary" disableElevation onClick={()=>{props.showAns()}}>
                    Answer
                </Button>
                <Button className='button' color="primary" disableElevation onClick={()=>{props.shuffleCells()}}>
                    shuffle
                </Button>
            </div>
        </div>
    );
}

export default Controle;
