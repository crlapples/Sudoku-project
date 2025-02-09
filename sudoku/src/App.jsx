import React, { useState, useEffect } from 'react';
import "./App.css";

function isValid(grid) {
  for (let i = 0; i < 3; i++) {
    let rowSum = grid[i].reduce((a, b) => a + b, 0);
    if (rowSum !== 15) return false;
  }

  for (let j = 0; j < 3; j++) {
    let colSum = 0;
    for (let i = 0; i < 3; i++) {
      colSum += grid[i][j];
    }
    if (colSum !== 15) return false;
  }

  return true;
}

function generateSudoku(grid, usedNumbers) {
  if (usedNumbers.size === 9) {
    if (isValid(grid)) {
      return grid;
    }
    return null;
  }

  let availableNumbers = [];
  for (let num = 1; num <= 9; num++) {
    if (!usedNumbers.has(num)) {
      availableNumbers.push(num);
    }
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i][j] === 0) {
        for (let num of availableNumbers) {
          let randomNum = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
          grid[i][j] = randomNum;
          usedNumbers.add(randomNum);

          let result = generateSudoku(grid, new Set(usedNumbers));
          if (result) {
            return result;
          }

          grid[i][j] = 0;
          usedNumbers.delete(randomNum);
        }
      }
    }
  }

  return null;
}

function generateNewPuzzle() {
  let grid = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  let usedNumbers = new Set();
  return generateSudoku(grid, usedNumbers);
}

const App = () => {
  const [sudoku, setSudoku] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [active, setActive] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [fixedGrid, setFixedGrid] = useState([]);
  const [puzzling, setPuzzling] = useState(false);

  const newSudoku = () => {
    setIsLoading(true);
    setPuzzling(false);
    setTime(0);
    setTimerActive(false);
    setMessage("");
    let grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    let usedNumbers = new Set();

    setTimeout(() => {
      let generateNewSudoku = generateSudoku(grid, usedNumbers);

      if (generateNewSudoku) {
        const cellsToReveal = 3;
        let count = 0;

        while (count < (9 - cellsToReveal)) {
          const row = Math.floor(Math.random() * 3);
          const col = Math.floor(Math.random() * 3);

          if (generateNewSudoku[row][col] !== 0) {
            generateNewSudoku[row][col] = 0;
            count++;
          }
        }
        
        const fixedNumbers = generateNewSudoku.map(row => row.slice());
        
        setSudoku(generateNewSudoku);
        setFixedGrid(fixedNumbers);
        setIsLoading(false);
        setPuzzling(true);
        startTimer();
      }
    }, 0);
  };

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerActive]);

  const startTimer = () => {
    setTimerActive(true);
  };

  const stopTimer = () => {
    setTimerActive(false);
  };

  const unHide = () => {
    setActive(prevState => !prevState);
  };

  const handleInputChange = (e, row, col) => {
    const newValue = parseInt(e.target.value, 10);
    
    if ((newValue >= 1 && newValue <= 9) || isNaN(newValue)) {
      const newSudoku = sudoku.map((r, rIdx) => r.map((c, cIdx) => (rIdx === row && cIdx === col ? (isNaN(newValue) ? 0 : newValue) : c))
      );
      setSudoku(newSudoku);
      
      if (isValid(newSudoku)) {
        setMessage("Completed✔");
        stopTimer();
      } else {
        setMessage("");
      }
    }
  };

  return (
    <div className="appContainer">
      <button onClick={newSudoku} className="newButton">
        {isLoading ? "Generating..." : "Generate Puzzle"}
      </button>
      <div className="main">
        <div className="mainWithMes">
          {isLoading ? (
            <div className="loadingMessage"></div>
          ) : (
            sudoku && Array.isArray(sudoku) && (
              <div className="box">
                {sudoku.flat().map((num, index) => {
                  const row = Math.floor(index / 3);
                  const col = index % 3;
                  return (
                    <div key={index} className="numbers">
                      {fixedGrid[row][col] !== 0 ? (
                        <span className="clue">{sudoku[row][col]}</span>
                        ) : (
                        <input
                          type="number"
                          min="1"
                          max="9"
                          value={sudoku[row][col] === 0 ? '' : sudoku[row][col]}
                          onChange={(e) => handleInputChange(e, row, col)}
                          className="input" 
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}
          <div className="details">
            <div className="winMessage">{message}</div>
            <div className={`time ${puzzling ? '' : 'hidden'}`}>{Math.floor(time / 60)}:{time % 60 < 10 ? `0${time % 60}` : time % 60}</div>
          </div>
        </div>
      </div>
      <div className="hintContainer">
        <button onClick={unHide} className={`hint ${active ? '' : 'center'}`}>Hint</button>
        <p className={`hintP ${active ? '' : 'hide'}`}>:Sum each row and column to the same value</p>
      </div>
    </div>
  );
};

export default App;
