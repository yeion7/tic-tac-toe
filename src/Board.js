import React from 'react';

function Board({ squares, onClick }) {
  const renderSquare = i => (<button className="square" onClick={() => onClick(i)} aria-label={`square-${i}, selected by ${squares[i] || 'nobody'}`}>
    {squares[i]}
  </button>);
  return (<div id="board">
    <div className="board-row">
      {renderSquare(0)}
      {renderSquare(1)}
      {renderSquare(2)}
    </div>
    <div className="board-row">
      {renderSquare(3)}
      {renderSquare(4)}
      {renderSquare(5)}
    </div>
    <div className="board-row">
      {renderSquare(6)}
      {renderSquare(7)}
      {renderSquare(8)}
    </div>
  </div>);
}

/**
 * @typedef {'X' | 'O' | *} Cell
 * @typedef {[Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]} Squares
 * @typedef {{squares: Squares}} Turn
 * @param {{history: Turn[], entryNumber: number}} state
 * @param {{type: 'ADD_ENTRY', newEntry: Turn} | { type:'GO_TO_ENTRY', entryNumber: number} } action
 */
export function historyReducer(state, action) {
  switch (action.type) {
    case 'ADD_ENTRY': {
      return {
        history: [...state.history, action.newEntry],
        entryNumber: state.entryNumber + 1,
      };
    }
    case 'GO_TO_ENTRY': {
      return {
        history: state.history.slice(0, action.entryNumber + 1),
        entryNumber: action.entryNumber,
      };
    }
    default:
      throw new Error(`Unhandled action type`);
  }
}

/**
 *
 * @param {Turn[]} initialHistory
 * @param {number} initialEntryNumber
 * @returns {{
 *  history: Turn[], 
 *  entryNumber: number, 
 *  current: Turn, 
 *  goToEntry: function
 *  addEntry: function
 * }}
 */
export function useHistory(initialHistory = [], initialEntryNumber = 0) {
  const [state, dispatch] = React.useReducer(historyReducer, {
    history: initialHistory,
    entryNumber: initialEntryNumber,
  });
  const { history, entryNumber } = state;
  const current = history[entryNumber];
  const goToEntry = newEntryNumber => dispatch({ type: 'GO_TO_ENTRY', entryNumber: newEntryNumber });
  const addEntry = newEntry => dispatch({ type: 'ADD_ENTRY', newEntry });
  return { history, entryNumber, current, goToEntry, addEntry };
}

export function useGame() {
  const { history, entryNumber, current, goToEntry, addEntry } = useHistory([
    { squares: [null, null, null, null, null, null, null, null, null] },
  ]);
  const xIsNext = entryNumber % 2 === 0;
  const { squares } = current;

  function selectSquare(square) {
    if (calculateWinner(squares) || squares[square]) {
      return;
    }
    const newSquares = [...squares];
    newSquares[square] = xIsNext ? 'X' : 'O';
    addEntry({ squares: newSquares });
  }
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  }
  else if (squares.every(Boolean)) {
    status = `Scratch: Cat's game`;
  }
  else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }
  return { history, squares, selectSquare, goToStep: goToEntry, status };
}

export function Game() {
  const { history, squares, selectSquare, goToStep, status } = useGame();
  const moves = history.map((_, stepNumber) => {
    const desc = stepNumber ? `Go to move #${stepNumber}` : 'Go to game start';
    return (<li key={stepNumber}>
      <button onClick={() => goToStep(stepNumber)}>{desc}</button>
    </li>);
  });
  return (<div className="game">
    <div className="game-board">
      <Board onClick={selectSquare} squares={squares} />
    </div>
    <div className="game-info">
      <div>{status}</div>
      <ol>{moves}</ol>
    </div>
  </div>);
}

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
