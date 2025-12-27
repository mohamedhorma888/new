import React, { useState } from 'react'

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!name.trim()) errs.name = 'Task name is required'
    if (!description.trim()) errs.description = 'Description is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const newTask = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
    }

    setTasks(prev => [newTask, ...prev])
    setName('')
    setDescription('')
    setErrors({})
  }

  return (
    <div>
      <h2>Tasks</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="taskName">Task Name</label><br />
          <input
            id="taskName"
            value={name}
            onChange={e => setName(e.target.value)}
            aria-invalid={!!errors.name}
          />
          {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label htmlFor="taskDesc">Description</label><br />
          <textarea
            id="taskDesc"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            aria-invalid={!!errors.description}
          />
          {errors.description && <div style={{ color: 'red' }}>{errors.description}</div>}
        </div>

        <button type="submit">Add Task</button>
      </form>

      <ul style={{ marginTop: 16 }}>
        {tasks.length === 0 ? (
          <li>No tasks yet</li>
        ) : (
          tasks.map(task => (
            <li key={task.id}>
              <strong>{task.name}</strong>: {task.description}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default TaskList