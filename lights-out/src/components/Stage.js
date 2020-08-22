import React from 'react';
import Logo from './Logo.js';

function TableData(props) {
    let i = props.i;
    let j = props.j;
    return (
        <td
            onClick={()=>{props.onClickCells(i, j)}}
            className={
                (props.state.guide && props.state.ans[i][j] ? 'guide':'') + ' ' +
                (props.state.cells[i][j] ? 'on':'off')
            }
        >
            {props.children}
        </td>
    );
}

function Table(props) {
    return(
        <div className='stage'>
            <table>
                <tbody>
                        {props.children}
                </tbody>
            </table>
        </div>
    );
}

function Stage(props) {
    return (
        <Table>
            {props.state.cells.map((row, i) => (
                <tr key={i*(props.state.wNum+1)}>
                    {row.map((_, j) => (
                        <TableData
                            key = {i*(props.state.wNum+1)+1+j}
                            state={props.state}
                            onClickCells={props.onClickCells}
                            i={i}
                            j={j}
                        >
                            <Logo />
                        </TableData>
                    ))}
                </tr>
            ))}
        </Table>
    );
}

export default Stage;
