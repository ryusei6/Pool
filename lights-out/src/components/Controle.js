import React from 'react';

function Controle(props) {
    return (
        <div className='controle'>
            <button onClick={()=>{props.showAns()}}>答えを表示</button>
            <button onClick={()=>{props.shuffleCells()}}>シャッフル</button>
        </div>
    );
}

export default Controle;
