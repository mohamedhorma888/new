import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/messages').then(res => setMessages(res.data));
  }, []);

  const addMessage = async () => {
    const res = await axios.post('http://localhost:5000/messages', { text: input });
    setMessages([...messages, res.data]);
    setInput('');
  };

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addMessage}>Add Message</button>
      {messages.map(m => <p key={m._id}>{m.text}</p>)}
    </div>
  );
}

export default App;