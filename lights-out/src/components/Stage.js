import React from 'react';
// import logoON from './logo-on.svg'
// import logoOFF from './logo-off.svg'
import Logo from './Logo.js';

class Stage extends React.Component {
    constructor(props) {
        super(props);
        let w_num = 5;
        let h_num = 5;

        let cells = Array(h_num);
        for(let i = 0; i<h_num; i++) {
            cells[i] = new Array(w_num).fill(true);
        }
        this.state = {
            w_num: w_num,
            h_num: h_num,
            cells: cells,
        };
    };

    toggle(e, i, j){
        const cells = this.state.cells.slice();
        let H = [0, 0, 0, -1, 1];
        let W = [0, 1, -1, 0, 0];
        for(let k=0; k<H.length; k++){
            let h = i + H[k];
            let w = j + W[k];
            if (!(0<=h && h<=this.state.h_num-1 && 0<=w && w<=this.state.w_num-1)){
                continue;
            }
            cells[h][w] = !cells[h][w];
        }
        this.setState({cells: cells});
    }

    render() {
        return (
            <div className='stage'>
                <table>
                    <tbody>
                        {this.state.cells.map((row, i) => {
                            return (
                                <tr className='cell' key={i*(this.state.w_num+1)}>
                                    {row.map((col, j) => {
                                        return (
                                            <td
                                                key = {i*(this.state.w_num+1)+1+j}
                                                onClick={(e)=>{this.toggle(e,i,j)}}
                                                className={this.state.cells[i][j] ? 'on':'off'}
                                            >
                                                <Logo />
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    };
}

export default Stage;
