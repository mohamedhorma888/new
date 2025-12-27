import React, { useState } from 'react'
import './TaskList.css'

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})

  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editErrors, setEditErrors] = useState({})

  const validate = (n, d) => {
    const errs = {}
    if (!n.trim()) errs.name = 'Task name is required'
    if (!d.trim()) errs.description = 'Description is required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(name, description)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    const newTask = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      completed: false,
    }

    setTasks(prev => [newTask, ...prev])
    setName('')
    setDescription('')
    setErrors({})
  }

  const toggleComplete = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setEditErrors({})
    }
  }

  const startEdit = (task) => {
    setEditingId(task.id)
    setEditName(task.name)
    setEditDescription(task.description)
    setEditErrors({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditErrors({})
  }

  const saveEdit = (e) => {
    e.preventDefault()
    const errs = validate(editName, editDescription)
    if (Object.keys(errs).length) {
      setEditErrors(errs)
      return
    }

    setTasks(prev => prev.map(t => t.id === editingId ? { ...t, name: editName.trim(), description: editDescription.trim() } : t))
    setEditingId(null)
    setEditErrors({})
  }

  const taskStyle = (completed) => ({
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
    background: completed ? '#f7f7f7' : '#fff',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  })

  const textStyle = (completed) => ({
    textDecoration: completed ? 'line-through' : 'none',
    opacity: completed ? 0.7 : 1,
  })

  return (
    <div className="task-list">
      <h2>Tasks</h2>

      <form onSubmit={handleSubmit} noValidate className="task-form">
        <div className="form-row">
          <label htmlFor="taskName">Task Name</label>
          <input
            id="taskName"
            className="input"
            value={name}
            onChange={e => setName(e.target.value)}
            aria-invalid={!!errors.name}
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>

        <div className="form-row">
          <label htmlFor="taskDesc">Description</label>
          <textarea
            id="taskDesc"
            className="input"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            aria-invalid={!!errors.description}
          />
          {errors.description && <div className="error">{errors.description}</div>}
        </div>

        <div style={{ alignSelf: 'end' }}>
          <button type="submit" className="btn btn-primary">Add Task</button>
        </div>
      </form>

      <ul className="tasks-list" style={{ marginTop: 8 }}>
        {tasks.length === 0 ? (
          <li>No tasks yet</li>
        ) : (
          tasks.map(task => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              {editingId === task.id ? (
                <form onSubmit={saveEdit} className="edit-form">
                  <div style={{ flex: 1 }}>
                    <input className="input" value={editName} onChange={e => setEditName(e.target.value)} />
                    {editErrors.name && <div className="error">{editErrors.name}</div>}
                    <textarea className="input" value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={2} style={{ marginTop: 8 }} />
                    {editErrors.description && <div className="error">{editErrors.description}</div>}
                  </div>
                  <div className="task-actions">
                    <button className="btn btn-primary" type="submit">Save</button>
                    <button className="btn btn-secondary" type="button" onClick={cancelEdit}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="task-left">
                    <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)} aria-label={`Mark ${task.name} completed`} />
                    <div className="task-text">
                      <div className="task-title">{task.name}</div>
                      <div className="task-desc">{task.description}</div>
                    </div>
                  </div>

                  <div className="task-actions">
                    <button className="btn btn-secondary" onClick={() => startEdit(task)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default TaskList