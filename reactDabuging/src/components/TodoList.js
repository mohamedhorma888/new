import React, { useState } from 'react';
import TodoItem from './TodoItem';

function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, title: 'Learn React', completed: false },
    { id: 2, title: 'Debug with DevTools', completed: true },
    { id: 3, title: 'Build a project', completed: false }
  ]);
  
  const [inputValue, setInputValue] = useState('');

  // BUG #9: ID generation is not unique - could cause duplicate IDs
  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Math.floor(Math.random() * 100), // Bad ID generation
        title: inputValue,
        completed: false
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  // BUG #10: toggleTodo function is missing the proper state update logic
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // BUG #11: This function passes undefined values to child component
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // BUG #12: Completed todos count calculation might be wrong if there are duplicate IDs
  const completedCount = todos.filter(t => t.completed).length;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="card">
      <h2>Todo List Component</h2>
      
      <div className="todo-input-group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <p>Tasks: {todos.length} | Completed: {completedCount}</p>

      <div className="todo-list">
        {todos.map(todo => (
          <TodoItem 
            key={todo.id}
            id={todo.id}
            title={todo.title}
            completed={todo.completed}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => removeTodo(todo.id)}
          />
        ))}
      </div>

      {todos.length === 0 && (
        <p style={{ color: '#999', textAlign: 'center' }}>No todos yet. Add one to get started!</p>
      )}
    </div>
  );
}

export default TodoList;
