import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [boardSize, setBoardSize] = useState(3); // 3 for 3x3, 5 for 5x5
  const [board, setBoard] = useState(Array(boardSize * boardSize).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [gameMode, setGameMode] = useState('2-player') // '1-player' or '2-player'
  
  // Reset board when size changes
  useEffect(() => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setXIsNext(true);
  }, [boardSize]);
  
  // Effect for computer's move
  useEffect(() => {
    // Only make a move if it's 1-player mode, it's O's turn (computer), and the game is not over
    if (gameMode === '1-player' && !xIsNext && !calculateWinner(board, boardSize) && !board.every(cell => cell !== null)) {
      const timerId = setTimeout(() => {
        makeComputerMove();
      }, 500); // Slight delay to make it feel more natural
      
      return () => clearTimeout(timerId);
    }
  }, [board, xIsNext, gameMode]);
  
  const handleClick = (index) => {
    // If cell is already filled or game is won, do nothing
    if (board[index] || calculateWinner(board, boardSize)) return
    
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
    const bestMove = findBestMove(board, boardSize);
    
    if (bestMove !== -1) {
      const newBoard = [...board];
      newBoard[bestMove] = 'O';
      setBoard(newBoard);
      setXIsNext(true);
    }
  }
  
  const resetGame = () => {
    setBoard(Array(boardSize * boardSize).fill(null))
    setXIsNext(true)
  }
  
  const toggleGameMode = () => {
    setGameMode(gameMode === '1-player' ? '2-player' : '1-player');
    resetGame();
  }
  
  const toggleBoardSize = () => {
    setBoardSize(boardSize === 3 ? 5 : 3);
  }
  
  const winner = calculateWinner(board, boardSize)
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
        
        <div className="controls">
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
          
          <div className="size-toggle">
            <button 
              className={`size-button ${boardSize === 3 ? 'active' : ''}`} 
              onClick={() => boardSize !== 3 && toggleBoardSize()}
            >
              3×3
            </button>
            <button 
              className={`size-button ${boardSize === 5 ? 'active' : ''}`} 
              onClick={() => boardSize !== 5 && toggleBoardSize()}
            >
              5×5
            </button>
          </div>
        </div>
        
        <div className="status">{status}</div>
        
        <div className={`board board-${boardSize}`}>
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
function calculateWinner(squares, boardSize) {
  const lines = [];
  
  // Add rows
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(i * boardSize + j);
    }
    lines.push(row);
  }
  
  // Add columns
  for (let i = 0; i < boardSize; i++) {
    const col = [];
    for (let j = 0; j < boardSize; j++) {
      col.push(j * boardSize + i);
    }
    lines.push(col);
  }
  
  // Add diagonals
  const diag1 = [];
  const diag2 = [];
  for (let i = 0; i < boardSize; i++) {
    diag1.push(i * boardSize + i);
    diag2.push(i * boardSize + (boardSize - 1 - i));
  }
  lines.push(diag1);
  lines.push(diag2);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if all cells in the line have the same non-null value
    if (line.every(index => squares[index] && squares[index] === squares[line[0]])) {
      return squares[line[0]];
    }
  }
  
  return null;
}

// AI functions for computer player
function findBestMove(board, boardSize) {
  // First, check if computer can win in the next move
  const winMove = findWinningMove(board, 'O', boardSize);
  if (winMove !== -1) return winMove;
  
  // Second, block player if they can win in the next move
  const blockMove = findWinningMove(board, 'X', boardSize);
  if (blockMove !== -1) return blockMove;
  
  // Take center if available
  const centerIndex = Math.floor(board.length / 2);
  if (board[centerIndex] === null) return centerIndex;
  
  // Take corners if available
  const corners = boardSize === 3 
    ? [0, 2, 6, 8] 
    : [0, 4, 20, 24];
    
  const availableCorners = corners.filter(i => board[i] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  // Take any available cell
  const availableCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
  if (availableCells.length > 0) {
    return availableCells[Math.floor(Math.random() * availableCells.length)];
  }
  
  // No moves available
  return -1;
}

function findWinningMove(board, player, boardSize) {
  // Generate all possible winning lines
  const lines = [];
  
  // Add rows
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(i * boardSize + j);
    }
    lines.push(row);
  }
  
  // Add columns
  for (let i = 0; i < boardSize; i++) {
    const col = [];
    for (let j = 0; j < boardSize; j++) {
      col.push(j * boardSize + i);
    }
    lines.push(col);
  }
  
  // Add diagonals
  const diag1 = [];
  const diag2 = [];
  for (let i = 0; i < boardSize; i++) {
    diag1.push(i * boardSize + i);
    diag2.push(i * boardSize + (boardSize - 1 - i));
  }
  lines.push(diag1);
  lines.push(diag2);
  
  // Check each line for a potential winning move
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Count player's marks and empty cells in this line
    let playerCount = 0;
    let emptyIndex = -1;
    
    for (let j = 0; j < line.length; j++) {
      const index = line[j];
      if (board[index] === player) {
        playerCount++;
      } else if (board[index] === null) {
        emptyIndex = index;
      }
    }
    
    // If the line has boardSize-1 of player's marks and one empty cell, that's a winning move
    if (playerCount === boardSize - 1 && emptyIndex !== -1) {
      return emptyIndex;
    }
  }
  
  return -1; // No winning move found
}

export default App 