import React from 'react';
import PropTypes from 'prop-types'; // If using prop-types library

// FIXED: Properly destructure props for better readability and maintainability
function TodoItem({ id, title, completed, onToggle, onDelete }) {
  return (
    <div className={`todo-item ${completed ? 'completed' : ''}`}>
      <span>{title}</span>
      <div>
        <button onClick={onToggle}>
          {completed ? 'Undo' : 'Complete'}
        </button>
        <button onClick={onDelete} className="delete">Delete</button>
      </div>
    </div>
  );
}

// OPTIONAL: Add PropTypes for runtime prop validation (requires prop-types package)
// Uncomment if prop-types is installed
/*
TodoItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
*/

export default TodoItem;
