import React, { useState } from 'react';
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
  };
  
function generateSudoku(grid, usedNumbers) {
    if (usedNumbers.length === 9) {
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
            
            let result = generateSudoku(grid, usedNumbers);
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
  };

const App = () => {
  const [sudoku, setSudoku] = useState(null);
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [num3, setNum3] = useState("");
  const [num4, setNum4] = useState("");
  const [num5, setNum5] = useState("");
  const [num6, setNum6] = useState("");
  const [num7, setNum7] = useState("");
  const [num8, setNum8] = useState("");
  const [num9, setNum9] = useState("");
  const [message, setMessage] = useState("");
  
  const newSudoku = () => {
    let grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    let usedNumbers = new Set();
    let generateNewSudoku = generateSudoku(grid, usedNumbers);
    setSudoku(generateNewSudoku);
  }
  
  const win = () => {
    if (num1 + num2 + num3 == 15 && num4 + num5 + num6 == 15 && num7 + num8 + num9 == 15 && num1 + num4 + num7 == 15 && num2 + num5 + num8 == 15 && num3 + num6 + num9 == 15) {
      setMessage("Completed✓");
    }
  };
  
  return (
    <div className="appContainer">
      <button onClick={newSudoku} className="newButton">Generate Puzzle</button>
      <div className="main">
        <div className="mainWithMes">
          {sudoku && (
            <div className="box">
              {sudoku.flat().map((num, index) => (
                <div key={index} className="numbers">
                  {num}
                </div>
              ))}
            </div>
          )}
          <div className="details">
            <div className="winMessage">
              
            </div>
            <div className="time">
              
            </div>
          </div>
        </div>
      </div>
      <div className="hintContainer">
        <button className="hint">Hint</button>
        <p className="hintP">:Sum each row and column to the same value</p>
      </div>
    </div>
  );
};

export default App;
