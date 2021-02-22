import React, { useState } from "react";

import Board from "./board/Board";
import "./Game.css";

const makeInitialArr = (numberOfSockets) => {
  const initialArr = [];
  for (var i = 0; i < numberOfSockets; i++) {
    initialArr[i] = { hasPawn: true, clicked: false };
  }
  initialArr[Math.floor(numberOfSockets / 2)] = {
    hasPawn: false,
    clicked: false,
    rowIndex: 0,
    columnIndex: 0,
  };
  return initialArr;
};

const Game = () => {
  const jumpSize = 1; // how many times to increase game size (so it is centered)
  const boardSize = 3 + 4 * jumpSize; // size of longest rows
  let numberOfSockets = boardSize * Math.floor(boardSize / 2); // the center rows (the long rows)
  numberOfSockets +=
    (boardSize - Math.floor(boardSize / 2)) * Math.floor(boardSize / 2); // adding the top and bottom rows (the short rows)
  const initialPawnArr = makeInitialArr(numberOfSockets); // the constent of all sockets on the board of an unplayed game
  const [pawnArr, setPawnArr] = useState(initialPawnArr); // the constent of all sockets on the board
  const [clickedIndex, setClickedIndex] = useState(-1); // -1 if no one is clicked else it receives the number of the clicked socket
  const [numberOfPawnsToEat, setNumberOfPawnsToEat] = useState(
    numberOfSockets - 2
  ); //the number of pawns left to eat (if 0 then the game is won)
  const [history, setHistory] = useState([
    initialPawnArr.map((socket) => {
      return { ...socket };
    }),
  ]); // history of game states
  const [currentMoveCount, setCurrentMoveCount] = useState(0); // how many move have been palyed to the current play (if we undo a move then its count is dropped by 1)

  const SquareClickHandler = (squareIndex) => () => {
    // console.log("columnIndex is: " + pawnArr[squareIndex].columnIndex);
    if (clickedIndex === -1) {
      if (!pawnArr[squareIndex].hasPawn) return; //trying to play with a socket that has no pawn
      setClickedIndex(squareIndex);
      pawnArr[squareIndex].clicked = true;
      return;
    }
    if (clickedIndex === squareIndex) {
      //clicking on a clicked pawn (now we unclick it)
      setClickedIndex(-1);
      pawnArr[squareIndex].clicked = false;
      return;
    }
    if (pawnArr[squareIndex].hasPawn) {
      //a pawn is already clicked and now another is being clicked
      return;
    }

    eatPawn(clickedIndex, squareIndex, "row");
    eatPawn(clickedIndex, squareIndex, "column");
  };

  const eatPawn = (jumpFromIndex, jumpToIndex, rowOrColumn) => {
    const jumpFrom = pawnArr[jumpFromIndex];
    const jumpTo = pawnArr[jumpToIndex];
    // console.log("jumpFrom.columnIndex is: " + jumpFrom.columnIndex);
    // console.log("jumpTo.columnIndex is: " + jumpTo.columnIndex);
    if (rowOrColumn === "row" && jumpFrom.rowIndex !== jumpTo.rowIndex) return;
    if (rowOrColumn === "column" && jumpFrom.columnIndex !== jumpTo.columnIndex)
      return;
    const distance =
      rowOrColumn === "row"
        ? Math.abs(jumpFrom.columnIndex - jumpTo.columnIndex)
        : Math.abs(jumpFrom.rowIndex - jumpTo.rowIndex);

    if (distance !== 2) return; // wrong distance between pawns

    // middlePawnIndex = (jumpFromIndex + jumpToIndex) / 2;
    let middlePawnIndex;

    if (rowOrColumn === "row") {
      middlePawnIndex = (jumpFromIndex + jumpToIndex) / 2;
    } else {
      const shortRowSize = Math.floor(boardSize / 2);
      const numOfShortRows = (boardSize - shortRowSize) / 2; //number of short rows on top/bottom (half of total)
      const longRowSize = boardSize; //number of sockets on long rows
      const numOfLongRows = boardSize - 2 * numOfShortRows; //number of long rows (center of board)
      const topIndex =
        jumpFrom.rowIndex < jumpTo.rowIndex ? jumpFromIndex : jumpToIndex; //top->higher pawn
      const bottomIndex =
        jumpFrom.rowIndex > jumpTo.rowIndex ? jumpFromIndex : jumpToIndex; //bottom->lower pawn

      const startOfMiddleRows = numOfShortRows * shortRowSize;
      const startOfBottomShortRows =
        numOfShortRows * shortRowSize + longRowSize * numOfLongRows;
      console.log("bottomIndex is: " + bottomIndex);
      console.log("startOfMiddleRows is: " + startOfMiddleRows);

      if (
        topIndex <
        startOfMiddleRows - shortRowSize // eating between short rows at top
      ) {
        console.log("1");
        middlePawnIndex = topIndex + shortRowSize;
      } else if (topIndex >= startOfBottomShortRows - longRowSize) {
        // eating between short rows at bottom
        console.log("2");
        middlePawnIndex = bottomIndex - shortRowSize;
      } else if (
        topIndex >= startOfMiddleRows &&
        bottomIndex <= startOfBottomShortRows // eating between long rows
      ) {
        console.log("3");
        middlePawnIndex = topIndex + longRowSize;
      } else {
        console.log("4");
        middlePawnIndex =
          topIndex < startOfMiddleRows
            ? topIndex + (shortRowSize + longRowSize) / 2 // eating from short row at top to long rows
            : bottomIndex - (shortRowSize + longRowSize) / 2; // eating from short row at bottom to long rows
      }
    }

    if (
      //there is a pawn to eat
      pawnArr[middlePawnIndex].hasPawn
    ) {
      //moving pawn
      jumpFrom.clicked = false;
      jumpFrom.hasPawn = false;
      setClickedIndex(-1);
      jumpTo.hasPawn = true;
      setNumberOfPawnsToEat((prev) => prev - 1);

      //eating pawn
      pawnArr[middlePawnIndex].hasPawn = false;

      const newHistory = [...history];
      setHistory((prev) => [
        ...prev.slice(0, currentMoveCount + 1),
        pawnArr.map((socket) => {
          return { ...socket };
        }),
      ]);
      setCurrentMoveCount((prev) => prev + 1);
    }
  };

  const resetHandler = () => {
    setPawnArr(initialPawnArr);
    setHistory([
      initialPawnArr.map((socket) => {
        return { ...socket };
      }),
    ]);
    setCurrentMoveCount(0);
    setNumberOfPawnsToEat(numberOfSockets - 2);
    setClickedIndex(-1);
  };

  const undoHandler = () => {
    if (currentMoveCount > 0) {
      setPawnArr(
        history[currentMoveCount - 1].map((socket) => {
          return { ...socket };
        })
      );
      setCurrentMoveCount((prev) => prev - 1);
      setClickedIndex(-1);
      setNumberOfPawnsToEat((prev) => prev + 1);
    }
  };

  const title = numberOfPawnsToEat === 0 ? "YOU WON!!!!" : "";
  return (
    <div className='game-area'>
      {title ? <h1>{title}</h1> : ""}
      <Board
        boardSize={boardSize}
        pawnArr={pawnArr}
        SquareClickHandler={SquareClickHandler}
      />
      <button onClick={resetHandler}>Reset</button>
      <button onClick={undoHandler}>Undo</button>
    </div>
  );
};

export default Game;
