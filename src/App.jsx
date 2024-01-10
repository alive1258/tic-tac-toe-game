import { useState } from 'react'
import './App.css'

// Square component represents an individual square in the game board
function Square({ value, onSquareClick }) {
  return (
    <button
      onClick={onSquareClick}
      className="bg-white border  border-gray-400 h-12 w-12 m-1 leading-9 text-lg"
    >
      {value}
    </button>
  )
}

// Board component represents the game board composed of squares
function Board({ xIsNext, squares, onPlay }) {
  // Calculate the winner based on the current squares
  const winner = calculateWinner(squares)
  let status

  // Determine the game status based on the presence of a winner
  if (winner) {
    status = `Winner ${winner}`
  } else {
    status = 'Next Player ' + (xIsNext ? 'X' : 'O')
  }

  // Handle the click event on a square
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return
    }
    const nextSquares = squares.slice()
    if (xIsNext) {
      nextSquares[i] = 'X'
    } else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares)
  }

  return (
    <>
      <div>
        <h1>{status}</h1>
      </div>
      <div className="flex">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="flex">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="flex">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  )
}

// Game component manages the game state and renders the Board
export default function Game() {
  // State to manage game history and the current player (X or O)
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [xIsNext, setXIsNext] = useState(true)
  const [currentMove, setCurrentMove] = useState(0)

  // Get the current squares from the history
  const currentSquares = history[currentMove]

  // Function to handle a player's move
  function handlePlay(nextSquares) {
    setXIsNext(!xIsNext)
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(move) {
    setCurrentMove(move)
    setXIsNext(move % 2 === 0)
  }
  // Create a list of moves based on the game history
  const moves = history?.map((squares, move) => {
    let description

    // Determine the description for each move
    if (move > 0) {
      description = `Go to Move # ${move}`
    } else {
      description = `Go to start the game`
    }

    // Return a list item for each move with a button containing the description
    return (
      <li key={move} className="bg-gray-500 text-white mb-1 p-1">
        {' '}
        {/* Ensure to provide a unique key for each list item */}
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })
  return (
    <div className="flex justify-center p-4">
      <div className="mr-16">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div>
        <ol className="border border-gray-400 p-4">{moves}</ol>
      </div>
    </div>
  )
}

// Function to determine the winner based on the current squares
function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null // Return null if there's no winner
}
