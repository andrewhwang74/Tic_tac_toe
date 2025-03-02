import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [gameMode, setGameMode] = useState('2-player') // '1-player' or '2-player'
  
  // Effect for computer's move
  useEffect(() => {
    // Only make a move if it's 1-player mode, it's O's turn (computer), and the game is not over
    if (gameMode === '1-player' && !xIsNext && !calculateWinner(board) && !board.every(cell => cell !== null)) {
      const timerId = setTimeout(() => {
        makeComputerMove();
      }, 500); // Slight delay to make it feel more natural
      
      return () => clearTimeout(timerId);
    }
  }, [board, xIsNext, gameMode]);
  
  const handleClick = (index) => {
    // If cell is already filled or game is won, do nothing
    if (board[index] || calculateWinner(board)) return
    
    // Create a copy of the board
    const newBoard = [...board]
    // Fill the cell with X or O
    newBoard[index] = xIsNext ? 'X' : 'O'
    
    // Update the board and toggle the player
    setBoard(newBoard)
    setXIsNext(!xIsNext)
  }
  
  const makeComputerMove = () => {
    // Get the best move for the computer
    const bestMove = findBestMove(board);
    
    if (bestMove !== -1) {
      const newBoard = [...board];
      newBoard[bestMove] = 'O';
      setBoard(newBoard);
      setXIsNext(true);
    }
  }
  
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
  }
  
  const toggleGameMode = () => {
    setGameMode(gameMode === '1-player' ? '2-player' : '1-player');
    resetGame();
  }
  
  const winner = calculateWinner(board)
  const isBoardFull = board.every(cell => cell !== null)
  
  let status
  if (winner) {
    status = `Winner: ${winner}`
  } else if (isBoardFull) {
    status = 'Game ended in a draw'
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`
    if (gameMode === '1-player') {
      status = xIsNext ? 'Your turn (X)' : 'Computer thinking...'
    }
  }

  // Function to determine cell content class
  const getCellClass = (value) => {
    if (value === 'X') return 'cell-x';
    if (value === 'O') return 'cell-o';
    return '';
  }

  return (
    <div className="app">
      <div className="tic-tac-toe">
        <h1>Tic Tac Toe</h1>
        <div className="mode-toggle">
          <button 
            className={`mode-button ${gameMode === '2-player' ? 'active' : ''}`} 
            onClick={() => gameMode !== '2-player' && toggleGameMode()}
          >
            2 Players
          </button>
          <button 
            className={`mode-button ${gameMode === '1-player' ? 'active' : ''}`} 
            onClick={() => gameMode !== '1-player' && toggleGameMode()}
          >
            vs Computer
          </button>
        </div>
        <div className="status">{status}</div>
        <div className="board">
          {board.map((cell, index) => (
            <div 
              key={index} 
              className={`cell ${getCellClass(cell)}`}
              onClick={() => handleClick(index)}
            >
              {cell}
            </div>
          ))}
        </div>
        <button className="reset-button" onClick={resetGame}>
          Reset Game
        </button>
      </div>
    </div>
  )
}

// Helper function to calculate winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal
    [2, 4, 6], // diagonal
  ]
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  
  return null
}

// AI functions for computer player
function findBestMove(board) {
  // First, check if computer can win in the next move
  const winMove = findWinningMove(board, 'O');
  if (winMove !== -1) return winMove;
  
  // Second, block player if they can win in the next move
  const blockMove = findWinningMove(board, 'X');
  if (blockMove !== -1) return blockMove;
  
  // Take center if available
  if (board[4] === null) return 4;
  
  // Take corners if available
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => board[i] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  // Take any available side
  const sides = [1, 3, 5, 7];
  const availableSides = sides.filter(i => board[i] === null);
  if (availableSides.length > 0) {
    return availableSides[Math.floor(Math.random() * availableSides.length)];
  }
  
  // No moves available
  return -1;
}

function findWinningMove(board, player) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // Check if player has two in a row and the third cell is empty
    if (board[a] === player && board[b] === player && board[c] === null) return c;
    if (board[a] === player && board[c] === player && board[b] === null) return b;
    if (board[b] === player && board[c] === player && board[a] === null) return a;
  }
  
  return -1; // No winning move found
}

export default App 