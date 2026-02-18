import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [incrementBy, setIncrementBy] = useState(1);

  const increment = () => {
    setCount(count + incrementBy);
  };

  const decrement = () => {
    setCount(count - incrementBy);
  };

  // FIXED: Now properly resets both count and incrementBy
  const reset = () => {
    setCount(0);
    setIncrementBy(1); // Reset to default increment value
  };

  // FIXED: Added validation to constrain incrementBy value between 1 and 50
  const handleIncrementByChange = (e) => {
    let value = parseInt(e.target.value);
    
    // Validate the input
    if (isNaN(value)) {
      value = 1;
    } else if (value < 1) {
      value = 1; // Minimum value is 1
    } else if (value > 50) {
      value = 50; // Maximum value is 50
    }
    
    setIncrementBy(value);
  };

  return (
    <div className="card">
      <h2>Counter Component</h2>
      <div className="counter-display">Count: {count}</div>
      
      <div>
        <label>Increment by (1-50): </label>
        <input 
          type="number" 
          value={incrementBy}
          onChange={handleIncrementByChange}
          placeholder="Enter increment value"
          min="1"
          max="50"
        />
      </div>

      <div>
        <button onClick={increment}>+ Increment</button>
        <button onClick={decrement}>- Decrement</button>
        <button onClick={reset}>Reset</button>
      </div>

      <p>Current increment value: {incrementBy}</p>
      
      {/* FIXED: Updated condition to warn for invalid values */}
      {(incrementBy < 1 || incrementBy > 50) && (
        <p style={{ color: 'red' }}>⚠️ Invalid increment value! Use 1-50.</p>
      )}
      
      {/* Added helpful info */}
      {incrementBy > 10 && (
        <p style={{ color: 'orange' }}>Tip: Large increment value will change count quickly!</p>
      )}
    </div>
  );
}

export default Counter;
