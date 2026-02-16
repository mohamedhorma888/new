import React from 'react';

export interface GreetingProps {
  name: string;
}

const Greeting: React.FC<GreetingProps> = ({ name }) => <div>Hello, {name}!</div>;

interface CounterState {
  count: number;
}

export class Counter extends React.Component<{}, CounterState> {
  state: CounterState = { count: 0 };

  increment = () => {
    this.setState((prev) => ({ count: prev.count + 1 }));
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

export default Greeting;
