import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// class Square extends React.Component{
  
//   render(){
//     return(
//       <button 
//       className="square" 
//       onClick={ ()=> this.props.onClick() }>
//         {this.props.value}
//       </button>
//     )
//   }
// }

// 函数组件写Square
function Square(props){
  return(
    <button 
    key={props.index}
    className="square"
    onClick={ props.onClick }>
      <span className={props.winner && props.winNum.indexOf(props.index) > -1 ? 'redColor' : ''}>{props.value}</span>
    </button>
  )
}

class Board extends React.Component{
  renderSquare(i){
    return (
      <Square 
      key={i}
      index={i}
      winner={this.props.winner}
      winNum={this.props.winNum}
      value={this.props.squares[i]}
      onClick = { ()=>this.props.onClick(i) }
      />
    )
  }

  render() {
    let squareDiv = []
    for(let i = 0; i < 9; i += 3){
      let squares = []
      for(let j = i; j < i + 3; j = j + 1){
        let square = this.renderSquare(j)
        squares.push(square)
      }
      squareDiv.push(<div key={i} className="board-row">{squares}</div>)
    }
    return(
      <div>
        {
          squareDiv
        /* <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div> */}
      </div>
    )
  }
}

class Game extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      clickNum:[],
      desc:false,//降序
      winNum:[null,null,null],
      winner:null
    }
  }

  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    // const squares = this.state.squares.slice()
    // const squares = this.state.squares // 关于不可变性的问题
    // squares[i] = 'X'
    if(calculateWinner(squares) || squares[i]){ //当有玩家胜出时，或者某个 Square 已经被填充时，该函数不做任何处理直接返回
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'

    let winResult = calculateWinner(squares)
    console.log('squares===',squares)
    console.log('calculateWinner(squares)===',calculateWinner(squares))
    console.log('winResult===',winResult)

    this.setState({
      // squares: squares,
      history:history.concat([{
        squares:squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      clickNum: this.state.clickNum.concat(i),
      winner: winResult ? winResult.winner : null,
      winNum: winResult ? winResult.winNum : null,
    })
  }

  jumpTo(step){ 
    const history = this.state.history.concat()
    const current = history[step]
    let winResult = calculateWinner(current.squares)
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      winner: winResult ? winResult.winner : null,
      winNum: winResult ? winResult.winNum : null,
    })
  }

  // 排序
  sort(){
    this.setState({
      desc:!this.state.desc
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    // const winner = calculateWinner(current.squares)
    let winResult = calculateWinner(current.squares)

    let coordinate=[[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3]]
    const moves = history.map((step,move) => {
      const desc = move ? 'Go to move#' + move : 'Go to game start'
      // 1 新增的（步骤坐标）功能
      let newCoordinate = ''
      if(this.state.clickNum.length > 0 && move > 0){
        let arr = coordinate[this.state.clickNum[move-1]]
        newCoordinate = arr.join(',')
      }
      // 2 新增 --- 选择的历史记录加粗
      let className = this.state.stepNumber===move ? 'boldLi' : ''
      return (
        <li className={className} key={move}>
          <button className={className} onClick={() => this.jumpTo(move)}>{desc}</button> {newCoordinate}
        </li>
      )
    })

    let status 
    if(winResult){
      status = 'Winner：' + winResult.winner
    } else if(this.state.stepNumber !== 9) {
      status = "Next player: "+ (this.state.xIsNext ? 'X' : 'O')
    } else if(this.state.stepNumber === 9 ){
      status = '平局'
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            winner = {this.state.winner}
            winNum = {this.state.winNum}
            onClick = { (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.desc ? moves.reverse() : moves}</ol>
        </div>
        <div>
          <button onClick={() => this.sort()}>排序</button>
        </div>
      </div>
    )
  }
}

// 判断出胜者
function calculateWinner(squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for(let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i]
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return {winner:squares[a],winNum:lines[i]}
    }
  }
  return null
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)
