import React from 'react';
import './Widget.css';

const Widget = ({ category, widget, onRemove }) => {
  return (
    <div className="widget">
      <h3>{widget.name}</h3>
      <p>{widget.text}</p>
      <button onClick={() => onRemove(category, widget.name)}>Remove</button>
    </div>
  );
};
export default Widget;