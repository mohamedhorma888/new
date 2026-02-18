import React, { useState } from 'react';

// BUG #5: Default props are not properly defined
function UserProfile({ name = 'John', age = 30, email = 'john@example.com' }) {
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice', age: 25, email: 'alice@example.com' },
    { id: 2, name: 'Bob', age: 35, email: 'bob@example.com' }
  ]);
  
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(1);

  const selectUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUserId(userId);
      setEditName(user.name);
      setEditAge(user.age);
      setEditEmail(user.email);
    }
  };

  const currentUser = users.find(u => u.id === selectedUserId);

  const startEditing = () => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditAge(currentUser.age);
      setEditEmail(currentUser.email);
      setIsEditing(true);
    }
  };

  // BUG #6: The update function doesn't validate data types
  const updateUser = () => {
    if (!editName.trim()) {
      alert('Name cannot be empty');
      return;
    }

    // BUG #7: editAge is never converted to a number
    setUsers(users.map(u => 
      u.id === selectedUserId 
        ? { ...u, name: editName, age: editAge, email: editEmail }
        : u
    ));
    
    setIsEditing(false);
  };

  const deleteUser = (userId) => {
    if (users.length > 1) {
      const newUsers = users.filter(u => u.id !== userId);
      setUsers(newUsers);
      // BUG #8: We don't update selectedUserId after deletion
      // This can result in displaying a user that no longer exists
    } else {
      alert('Cannot delete the last user');
    }
  };

  return (
    <div className="card">
      <h2>User Profile Component</h2>
      
      <div>
        <label>Select User: </label>
        <select value={selectedUserId} onChange={(e) => selectUser(parseInt(e.target.value))}>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} (ID: {user.id})
            </option>
          ))}
        </select>
      </div>

      {currentUser && (
        <div className="user-info">
          <p><strong>Name:</strong> {currentUser.name}</p>
          <p><strong>Age:</strong> {currentUser.age}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
        </div>
      )}

      {!isEditing ? (
        <>
          <button onClick={startEditing}>Edit User</button>
          <button onClick={() => deleteUser(selectedUserId)} className="delete">Delete User</button>
        </>
      ) : (
        <>
          <div>
            <label>Name: </label>
            <input 
              type="text" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>
          <div>
            <label>Age: </label>
            <input 
              type="number" 
              value={editAge} 
              onChange={(e) => setEditAge(e.target.value)}
            />
          </div>
          <div>
            <label>Email: </label>
            <input 
              type="email" 
              value={editEmail} 
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </div>
          <button onClick={updateUser}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      )}
    </div>
  );
}

export default UserProfile;
