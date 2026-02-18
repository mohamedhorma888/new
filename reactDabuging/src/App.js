import React, { useState } from 'react';
import Counter from './components/Counter';
import UserProfile from './components/UserProfile';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  const [appTitle] = useState('React Debugging Sample');

  return (
    <div className="App">
      <h1>{appTitle}</h1>
      <div className="container">
        <Counter />
        <UserProfile />
        <TodoList />
      </div>
    </div>
  );
}

export default App;
