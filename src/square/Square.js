import React from "react";

import "./Square.css";

const Square = ({ hasPawn, clicked, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`square piece ${hasPawn ? "pawn" : ""} ${
        clicked ? "clicked" : ""
      }`}
    >
      {hasPawn ? "😁" : ""}
    </button>
  );
};

export default Square;
