import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  // BUG #1: Missing dependency in reset handler
  const [incrementBy, setIncrementBy] = useState(1);

  const increment = () => {
    setCount(count + incrementBy);
  };

  const decrement = () => {
    setCount(count - incrementBy);
  };

  const reset = () => {
    // BUG #2: This should reset to 0 but the function has a typo
    setCount(0);
    // We'll intentionally not reset incrementBy to demonstrate a state management issue
  };

  // BUG #3: incrementBy prop is not properly constrained
  const handleIncrementByChange = (e) => {
    const value = parseInt(e.target.value);
    // BUG: No validation - negative or extremely large values can be set
    setIncrementBy(value);
  };

  return (
    <div className="card">
      <h2>Counter Component</h2>
      <div className="counter-display">Count: {count}</div>
      
      <div>
        <label>Increment by: </label>
        <input 
          type="number" 
          value={incrementBy}
          onChange={handleIncrementByChange}
          placeholder="Enter increment value"
        />
      </div>

      <div>
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
        <button onClick={reset}>Reset</button>
      </div>

      <p>Current increment value: {incrementBy}</p>
      {/* BUG #4: This condition is wrong - should warn when incrementBy is negative */}
      {incrementBy > 1000 && (
        <p style={{ color: 'red' }}>Warning: Large increment value!</p>
      )}
    </div>
  );
}

export default Counter;
