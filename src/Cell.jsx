// src/Cell.jsx
import React from 'react';
import './Cell.css';

const Cell = ({ data, isPlayer, isStart, isEnd }) => {
   if (!data || typeof data !== 'object') {
        console.error("Invalid data prop received by Cell:", data);
        return <div className="cell error-cell">X</div>; // Error indicator
   }

  const { top, right, bottom, left } = data;

  const classNames = [
    'cell',
    top ? 'wall-top' : '',
    right ? 'wall-right' : '',
    bottom ? 'wall-bottom' : '',
    left ? 'wall-left' : '',
    isPlayer ? 'player' : '',
    isStart ? 'start' : '',
    isEnd ? 'end' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classNames}></div>;
};

export default Cell;