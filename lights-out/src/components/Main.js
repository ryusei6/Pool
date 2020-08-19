import React from 'react';
import Stage from './Stage';
import Controle from './Controle';
import AlertDialog from './AlertDialog';


class Main extends React.Component {
    constructor(props) {
        super(props);
        this.child = React.createRef();

        let wNum = 5;
        let hNum = 5;
        let cells = Array(hNum).fill().map(() => Array(wNum).fill(0));
        let ans = Array(hNum).fill().map(() => Array(wNum).fill(0));
        this.state = {
            wNum: wNum,
            hNum: hNum,
            cells: cells,
            ans: ans,
            guide: false,
            cleared: false,
        };

        this.setToggldCells = this.setToggldCells.bind(this);
        this.onClickCells = this.onClickCells.bind(this);
        this.changeAnsCells = this.changeAnsCells.bind(this);
        this.toggleCells = this.toggleCells.bind(this);
        this.shuffleCells = this.shuffleCells.bind(this);
        this.showAns = this.showAns.bind(this);
        this.checkHasAns = this.checkHasAns.bind(this);
        this.calcAns = this.calcAns.bind(this);
        this.isCleared = this.isCleared.bind(this);
        this.resetClearedState = this.resetClearedState.bind(this);
    }

    componentDidMount() {
        this.shuffleCells();
    }

    componentDidUpdate(_, prevState) {
        if (this.state.cells !== prevState.cells) {
            this.setState({cleared: this.isCleared()});
        }
    }

    isCleared() {
        let cells = JSON.parse(JSON.stringify(this.state.cells));
        for (let i=0; i<this.state.hNum; i++) {
            for (let j=0; j<this.state.wNum; j++) {
                if (cells[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    resetClearedState() {
        this.setState({cleared: false });
    }

    onClickCells(i, j) {
        this.setToggldCells(i, j);
        if (this.state.guide) {this.changeAnsCells(i, j)}
    }

    changeAnsCells(i, j) {
        let ans = JSON.parse(JSON.stringify(this.state.ans));
        ans[i][j] = (ans[i][j]+1)%2;
        this.setState({ans: ans});
    }

    setToggldCells(i, j) {
        let cells = JSON.parse(JSON.stringify(this.state.cells));
        cells = this.toggleCells(cells, i,j);
        this.setState({cells: cells});
    }

    toggleCells(_cells, i, j){
        let cells = JSON.parse(JSON.stringify(_cells));
        let H = [0, 0, 0, -1, 1];
        let W = [0, 1, -1, 0, 0];
        for(let k=0; k<H.length; k++){
            let h = i + H[k];
            let w = j + W[k];
            if (!(0<=h && h<=this.state.hNum-1 && 0<=w && w<=this.state.wNum-1)){
                continue;
            }
            cells[h][w] = (cells[h][w]+1)%2;
        }
        return cells;
    }

    shuffleCells() {
        let plots = Array(this.state.hNum);
        for (let i=0; i<this.state.hNum; i++) {
            let _r = [];
            for (let j=0; j<this.state.wNum; j++) {
                let flag = Number(Math.random() < 0.5);
                _r.push(flag);
            }
            plots[i] = _r;
        }

        let cells = Array(this.state.hNum).fill().map(() => Array(this.state.wNum).fill(0));
        for (let i=0; i<plots.length; i++) {
            for (let j=0; j<plots[i].length; j++) {
                if (plots[i][j]) {
                    cells = this.toggleCells(cells, i, j);
                }
            }
        }
        this.setState({cells: cells});
        let ans = this.calcAns(cells);
        this.setState({ans: ans});
    }

    checkHasAns(_cells, _flip) {
        let flip = JSON.parse(JSON.stringify(_flip));
        let cells = JSON.parse(JSON.stringify(_cells));
        for (let i=1; i<this.state.hNum; i++) {
            for (let j=0; j<this.state.wNum; j++) {
                if (cells[i-1][j]) {
                    flip[i][j] = 1;
                    cells = this.toggleCells(cells, i, j);
                }
            }
        }
        for (let i=0; i<this.state.wNum; i++) {
            if (cells[this.state.hNum-1][i]) {
                return [false, flip];
            }
        }
        return [true, flip];
    }

    calcAns(_cells) {
        for (let i=0; i<2**this.state.wNum; i++) {
            let flip = Array(this.state.hNum).fill().map(() => Array(this.state.wNum).fill(0));
            let cells = JSON.parse(JSON.stringify(_cells));

            for (let j=0; j<this.state.wNum; j++) {
                flip[0][this.state.hNum-j-1] = (i>>j) & 1;
            }
            for (let j=0; j<this.state.wNum; j++) {
                if (flip[0][this.state.hNum-j-1]) {
                    cells = this.toggleCells(cells, 0, this.state.hNum-j-1);
                }
            }

            let flag;
            [flag, flip] = this.checkHasAns(cells, flip);
            if (flag) {return flip}
        }
    }

    showAns() {
        let cells = JSON.parse(JSON.stringify(this.state.cells));
        let ans = this.calcAns(cells);
        let guide = !this.state.guide;
        this.setState({ans: ans});
        this.setState({guide: guide});
    }

    render() {
        return (
            <div className='main'>
                <Stage
                    state={this.state}
                    onClickCells={this.onClickCells}
                />
                <Controle
                    state={this.state}
                    shuffleCells={this.shuffleCells}
                    showAns={this.showAns}
                />
                <AlertDialog
                    state={this.state}
                    ref={this.child}
                    shuffleCells={this.shuffleCells}
                    resetClearedState={this.resetClearedState}
                />
            </div>
        );
    }
}

export default Main;
