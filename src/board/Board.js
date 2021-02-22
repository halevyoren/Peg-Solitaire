import React from "react";

import Square from "../square/Square";
import "./Board.css";

const Board = ({ boardSize, pawnArr, SquareClickHandler }) => {
  const makeBoard = () => {
    const newBoard = [];
    let rowStart = 0;
    const shortJumpNumber = Math.floor(boardSize / 2); //number of sockets on short rows
    const longJumpNumber = boardSize; //number of sockets on long rows
    const topOrBottomRows = (boardSize - shortJumpNumber) / 2; //number of short rows on top/bottom
    const middleRows = boardSize - 2 * topOrBottomRows; //number of long rows (center of board)
    let rowIndex = 0;
    // top rows
    for (var row = 0; row < topOrBottomRows; row++) {
      insertRow(newBoard, shortJumpNumber, rowStart, rowIndex);
      rowStart += shortJumpNumber;
      rowIndex++;
    }
    // middle rows
    for (var row = 0; row < middleRows; row++) {
      insertRow(newBoard, longJumpNumber, rowStart, rowIndex);
      rowStart += longJumpNumber;
      rowIndex++;
    }
    // bottom rows
    for (var row = 0; row < topOrBottomRows; row++) {
      insertRow(newBoard, shortJumpNumber, rowStart, rowIndex);
      rowStart += shortJumpNumber;
      rowIndex++;
    }

    return newBoard;
  };
  const insertRow = (newBoard, rowSize, startIndex, rowIndex) => {
    let newRow = [];
    const fromWhere = startIndex + rowSize;
    let columnIndex = boardSize / 2 > rowSize ? (boardSize - rowSize) / 2 : 0;
    for (var i = startIndex; i < fromWhere; i++) {
      pawnArr[i].rowIndex = rowIndex;
      pawnArr[i].columnIndex = columnIndex;
      newRow.push(
        <Square
          key={i}
          hasPawn={pawnArr[i].hasPawn}
          clicked={pawnArr[i].clicked}
          onClick={SquareClickHandler(i)}
        />
      );
      columnIndex++;
    }
    newBoard.push(
      <div key={startIndex} className='row'>
        {newRow}
      </div>
    );
  };

  return <div className='board'>{makeBoard()}</div>;
};

export default Board;
