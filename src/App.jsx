import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const BOARD_SIZE = 6; // Fixed 6x6 board
  const WIN_CONDITION = 4; // 4 in a row to win
  
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null))
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
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null))
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
        <h1>Omok</h1>
        <h2>First 4 in a row wins!</h2>
        
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
        </div>
        
        <div className="status">{status}</div>
        
        <div className="board board-6">
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

// Helper function to calculate winner - checks for 4 in a row
function calculateWinner(squares) {
  const BOARD_SIZE = 6;
  const WIN_CONDITION = 4;
  
  // Check rows
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col <= BOARD_SIZE - WIN_CONDITION; col++) {
      const startIndex = row * BOARD_SIZE + col;
      let hasWinner = true;
      const firstValue = squares[startIndex];
      
      if (!firstValue) continue; // Skip if empty
      
      // Check if we have WIN_CONDITION consecutive same values
      for (let i = 1; i < WIN_CONDITION; i++) {
        if (squares[startIndex + i] !== firstValue) {
          hasWinner = false;
          break;
        }
      }
      
      if (hasWinner) return firstValue;
    }
  }
  
  // Check columns
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 0; row <= BOARD_SIZE - WIN_CONDITION; row++) {
      const startIndex = row * BOARD_SIZE + col;
      let hasWinner = true;
      const firstValue = squares[startIndex];
      
      if (!firstValue) continue; // Skip if empty
      
      // Check if we have WIN_CONDITION consecutive same values
      for (let i = 1; i < WIN_CONDITION; i++) {
        if (squares[startIndex + i * BOARD_SIZE] !== firstValue) {
          hasWinner = false;
          break;
        }
      }
      
      if (hasWinner) return firstValue;
    }
  }
  
  // Check diagonals (top-left to bottom-right)
  for (let row = 0; row <= BOARD_SIZE - WIN_CONDITION; row++) {
    for (let col = 0; col <= BOARD_SIZE - WIN_CONDITION; col++) {
      const startIndex = row * BOARD_SIZE + col;
      let hasWinner = true;
      const firstValue = squares[startIndex];
      
      if (!firstValue) continue; // Skip if empty
      
      // Check if we have WIN_CONDITION consecutive same values
      for (let i = 1; i < WIN_CONDITION; i++) {
        if (squares[startIndex + i * BOARD_SIZE + i] !== firstValue) {
          hasWinner = false;
          break;
        }
      }
      
      if (hasWinner) return firstValue;
    }
  }
  
  // Check diagonals (top-right to bottom-left)
  for (let row = 0; row <= BOARD_SIZE - WIN_CONDITION; row++) {
    for (let col = WIN_CONDITION - 1; col < BOARD_SIZE; col++) {
      const startIndex = row * BOARD_SIZE + col;
      let hasWinner = true;
      const firstValue = squares[startIndex];
      
      if (!firstValue) continue; // Skip if empty
      
      // Check if we have WIN_CONDITION consecutive same values
      for (let i = 1; i < WIN_CONDITION; i++) {
        if (squares[startIndex + i * BOARD_SIZE - i] !== firstValue) {
          hasWinner = false;
          break;
        }
      }
      
      if (hasWinner) return firstValue;
    }
  }
  
  return null;
}

// Improved AI functions for computer player
function findBestMove(board) {
  const BOARD_SIZE = 6;
  
  // First, check if computer can win in the next move
  const winMove = findWinningMove(board, 'O');
  if (winMove !== -1) return winMove;
  
  // Second, block player if they can win in the next move
  const blockMove = findWinningMove(board, 'X');
  if (blockMove !== -1) return blockMove;
  
  // Look for advanced threats - player has 2 in a row with open ends (potential for 3-in-a-row)
  const blockThreatMove = findOpenEndedThreats(board, 'X');
  if (blockThreatMove !== -1 && Math.random() < 0.9) { // 90% chance to block these threats
    return blockThreatMove;
  }
  
  // Look for opportunities to create 3-in-a-row with open ends
  const createThreatMove = findOpenEndedThreats(board, 'O');
  if (createThreatMove !== -1 && Math.random() < 0.85) { // 85% chance to create these threats
    return createThreatMove;
  }
  
  // Look for opportunities to create 3-in-a-row
  const threeInRowMove = findThreeInRowOpportunity(board, 'O');
  if (threeInRowMove !== -1 && Math.random() < 0.8) { // 80% chance to make this move
    return threeInRowMove;
  }
  
  // Block opponent's 3-in-a-row opportunities
  const blockThreeMove = findThreeInRowOpportunity(board, 'X');
  if (blockThreeMove !== -1 && Math.random() < 0.75) { // 75% chance to block
    return blockThreeMove;
  }
  
  // Take center-ish positions if available (the 4 center squares)
  const centerIndices = [
    BOARD_SIZE * (BOARD_SIZE/2 - 1) + (BOARD_SIZE/2 - 1),
    BOARD_SIZE * (BOARD_SIZE/2 - 1) + (BOARD_SIZE/2),
    BOARD_SIZE * (BOARD_SIZE/2) + (BOARD_SIZE/2 - 1),
    BOARD_SIZE * (BOARD_SIZE/2) + (BOARD_SIZE/2)
  ];
  
  const availableCenters = centerIndices.filter(i => board[i] === null);
  if (availableCenters.length > 0 && Math.random() < 0.7) { // 70% chance to take center
    return availableCenters[Math.floor(Math.random() * availableCenters.length)];
  }
  
  // Make a move adjacent to existing pieces (more strategic than random)
  const adjacentMove = findAdjacentMove(board);
  if (adjacentMove !== -1 && Math.random() < 0.65) { // 65% chance to make adjacent move
    return adjacentMove;
  }
  
  // Take any available cell
  const availableCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
  if (availableCells.length > 0) {
    return availableCells[Math.floor(Math.random() * availableCells.length)];
  }
  
  // No moves available
  return -1;
}

function findWinningMove(board, player) {
  const BOARD_SIZE = 6;
  const WIN_CONDITION = 4;
  
  // Check for potential winning moves in rows
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col <= BOARD_SIZE - WIN_CONDITION; col++) {
      const indices = Array.from({length: WIN_CONDITION}, (_, i) => row * BOARD_SIZE + col + i);
      const potentialWin = checkPotentialWin(board, indices, player);
      if (potentialWin !== -1) return potentialWin;
    }
  }
  
  // Check for potential winning moves in columns
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 0; row <= BOARD_SIZE - WIN_CONDITION; row++) {
      const indices = Array.from({length: WIN_CONDITION}, (_, i) => (row + i) * BOARD_SIZE + col);
      const potentialWin = checkPotentialWin(board, indices, player);
      if (potentialWin !== -1) return potentialWin;
    }
  }
  
  // Check for potential winning moves in diagonals (top-left to bottom-right)
  for (let row = 0; row <= BOARD_SIZE - WIN_CONDITION; row++) {
    for (let col = 0; col <= BOARD_SIZE - WIN_CONDITION; col++) {
      const indices = Array.from({length: WIN_CONDITION}, (_, i) => (row + i) * BOARD_SIZE + col + i);
      const potentialWin = checkPotentialWin(board, indices, player);
      if (potentialWin !== -1) return potentialWin;
    }
  }
  
  // Check for potential winning moves in diagonals (top-right to bottom-left)
  for (let row = 0; row <= BOARD_SIZE - WIN_CONDITION; row++) {
    for (let col = WIN_CONDITION - 1; col < BOARD_SIZE; col++) {
      const indices = Array.from({length: WIN_CONDITION}, (_, i) => (row + i) * BOARD_SIZE + col - i);
      const potentialWin = checkPotentialWin(board, indices, player);
      if (potentialWin !== -1) return potentialWin;
    }
  }
  
  return -1; // No winning move found
}

function checkPotentialWin(board, indices, player) {
  let playerCount = 0;
  let emptyIndex = -1;
  
  for (const index of indices) {
    if (board[index] === player) {
      playerCount++;
    } else if (board[index] === null) {
      emptyIndex = index;
    } else {
      // If there's an opponent's piece, this can't be a winning move
      return -1;
    }
  }
  
  // If there are 3 of player's pieces and 1 empty cell, that's a winning move
  if (playerCount === 3 && emptyIndex !== -1) {
    return emptyIndex;
  }
  
  return -1;
}

function findThreeInRowOpportunity(board, player) {
  const BOARD_SIZE = 6;
  const SEQUENCE_LENGTH = 3; // Looking for opportunities to create 3 in a row
  
  // Check rows
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col <= BOARD_SIZE - SEQUENCE_LENGTH; col++) {
      const indices = Array.from({length: SEQUENCE_LENGTH}, (_, i) => row * BOARD_SIZE + col + i);
      const opportunity = checkSequenceOpportunity(board, indices, player);
      if (opportunity !== -1) return opportunity;
    }
  }
  
  // Check columns
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 0; row <= BOARD_SIZE - SEQUENCE_LENGTH; row++) {
      const indices = Array.from({length: SEQUENCE_LENGTH}, (_, i) => (row + i) * BOARD_SIZE + col);
      const opportunity = checkSequenceOpportunity(board, indices, player);
      if (opportunity !== -1) return opportunity;
    }
  }
  
  // Check diagonals
  for (let row = 0; row <= BOARD_SIZE - SEQUENCE_LENGTH; row++) {
    for (let col = 0; col <= BOARD_SIZE - SEQUENCE_LENGTH; col++) {
      const indices = Array.from({length: SEQUENCE_LENGTH}, (_, i) => (row + i) * BOARD_SIZE + col + i);
      const opportunity = checkSequenceOpportunity(board, indices, player);
      if (opportunity !== -1) return opportunity;
    }
  }
  
  for (let row = 0; row <= BOARD_SIZE - SEQUENCE_LENGTH; row++) {
    for (let col = SEQUENCE_LENGTH - 1; col < BOARD_SIZE; col++) {
      const indices = Array.from({length: SEQUENCE_LENGTH}, (_, i) => (row + i) * BOARD_SIZE + col - i);
      const opportunity = checkSequenceOpportunity(board, indices, player);
      if (opportunity !== -1) return opportunity;
    }
  }
  
  return -1;
}

function checkSequenceOpportunity(board, indices, player) {
  let playerCount = 0;
  let emptyCells = [];
  
  for (const index of indices) {
    if (board[index] === player) {
      playerCount++;
    } else if (board[index] === null) {
      emptyCells.push(index);
    } else {
      // If there's an opponent's piece, this isn't a good opportunity
      return -1;
    }
  }
  
  // If there are 2 of player's pieces and 1 empty cell, that's a good opportunity
  if (playerCount === 2 && emptyCells.length === 1) {
    return emptyCells[0];
  }
  
  return -1;
}

// New function to find open-ended threats (two in a row with both ends open)
function findOpenEndedThreats(board, player) {
  const BOARD_SIZE = 6;
  
  // Check horizontal open-ended threats
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 1; col < BOARD_SIZE - 2; col++) {
      // Check for pattern: [empty][player][player][empty]
      const indices = [
        row * BOARD_SIZE + (col - 1),
        row * BOARD_SIZE + col,
        row * BOARD_SIZE + (col + 1),
        row * BOARD_SIZE + (col + 2)
      ];
      
      if (board[indices[0]] === null && 
          board[indices[1]] === player && 
          board[indices[2]] === player && 
          board[indices[3]] === null) {
        // Return one of the empty ends (randomly choose)
        return Math.random() < 0.5 ? indices[0] : indices[3];
      }
    }
  }
  
  // Check vertical open-ended threats
  for (let col = 0; col < BOARD_SIZE; col++) {
    for (let row = 1; row < BOARD_SIZE - 2; row++) {
      // Check for pattern: [empty][player][player][empty]
      const indices = [
        (row - 1) * BOARD_SIZE + col,
        row * BOARD_SIZE + col,
        (row + 1) * BOARD_SIZE + col,
        (row + 2) * BOARD_SIZE + col
      ];
      
      if (board[indices[0]] === null && 
          board[indices[1]] === player && 
          board[indices[2]] === player && 
          board[indices[3]] === null) {
        // Return one of the empty ends (randomly choose)
        return Math.random() < 0.5 ? indices[0] : indices[3];
      }
    }
  }
  
  // Check diagonal (top-left to bottom-right) open-ended threats
  for (let row = 1; row < BOARD_SIZE - 2; row++) {
    for (let col = 1; col < BOARD_SIZE - 2; col++) {
      // Check for pattern: [empty][player][player][empty]
      const indices = [
        (row - 1) * BOARD_SIZE + (col - 1),
        row * BOARD_SIZE + col,
        (row + 1) * BOARD_SIZE + (col + 1),
        (row + 2) * BOARD_SIZE + (col + 2)
      ];
      
      if (board[indices[0]] === null && 
          board[indices[1]] === player && 
          board[indices[2]] === player && 
          board[indices[3]] === null) {
        // Return one of the empty ends (randomly choose)
        return Math.random() < 0.5 ? indices[0] : indices[3];
      }
    }
  }
  
  // Check diagonal (top-right to bottom-left) open-ended threats
  for (let row = 1; row < BOARD_SIZE - 2; row++) {
    for (let col = 2; col < BOARD_SIZE - 1; col++) {
      // Check for pattern: [empty][player][player][empty]
      const indices = [
        (row - 1) * BOARD_SIZE + (col + 1),
        row * BOARD_SIZE + col,
        (row + 1) * BOARD_SIZE + (col - 1),
        (row + 2) * BOARD_SIZE + (col - 2)
      ];
      
      if (board[indices[0]] === null && 
          board[indices[1]] === player && 
          board[indices[2]] === player && 
          board[indices[3]] === null) {
        // Return one of the empty ends (randomly choose)
        return Math.random() < 0.5 ? indices[0] : indices[3];
      }
    }
  }
  
  return -1; // No open-ended threats found
}

// New function to find moves adjacent to existing pieces
function findAdjacentMove(board) {
  const BOARD_SIZE = 6;
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  // Find all non-empty cells
  const nonEmptyCells = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== null) {
      nonEmptyCells.push(i);
    }
  }
  
  // Shuffle the non-empty cells to add randomness
  for (let i = nonEmptyCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nonEmptyCells[i], nonEmptyCells[j]] = [nonEmptyCells[j], nonEmptyCells[i]];
  }
  
  // Check adjacent cells for each non-empty cell
  for (const cellIndex of nonEmptyCells) {
    const row = Math.floor(cellIndex / BOARD_SIZE);
    const col = cellIndex % BOARD_SIZE;
    
    // Shuffle directions to add randomness
    const shuffledDirections = [...directions];
    for (let i = shuffledDirections.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDirections[i], shuffledDirections[j]] = [shuffledDirections[j], shuffledDirections[i]];
    }
    
    // Check each direction
    for (const [dx, dy] of shuffledDirections) {
      const newRow = row + dx;
      const newCol = col + dy;
      
      // Check if the new position is within bounds
      if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
        const newIndex = newRow * BOARD_SIZE + newCol;
        
        // Check if the cell is empty
        if (board[newIndex] === null) {
          return newIndex;
        }
      }
    }
  }
  
  return -1; // No adjacent moves found
}

export default App 