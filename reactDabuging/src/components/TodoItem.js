import React from 'react';

// BUG #13: Props are not destructured properly
function TodoItem(props) {
  // BUG #14: Missing prop validation - if props are undefined, this will crash
  return (
    <div className={`todo-item ${props.completed ? 'completed' : ''}`}>
      <span>{props.title}</span>
      <div>
        <button onClick={props.onToggle}>
          {props.completed ? 'Undo' : 'Complete'}
        </button>
        <button onClick={props.onDelete} className="delete">Delete</button>
      </div>
    </div>
  );
}

export default TodoItem;
