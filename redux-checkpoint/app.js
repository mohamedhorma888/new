const { createStore, combineReducers } = Redux;
const { Provider, useSelector, useDispatch } = ReactRedux;

// Action types
const ADD_TASK = 'ADD_TASK';
const TOGGLE_TASK = 'TOGGLE_TASK';
const UPDATE_TASK = 'UPDATE_TASK';
const SET_FILTER = 'SET_FILTER';

// Action creators
const addTask = (task) => ({ type: ADD_TASK, payload: task });
const toggleTask = (id) => ({ type: TOGGLE_TASK, payload: id });
const updateTask = (id, description) => ({ type: UPDATE_TASK, payload: { id, description } });
const setFilter = (filter) => ({ type: SET_FILTER, payload: filter });

// Reducers
function tasksReducer(state = [], action) {
  switch (action.type) {
    case ADD_TASK:
      return [...state, action.payload];
    case TOGGLE_TASK:
      return state.map(t => t.id === action.payload ? { ...t, isDone: !t.isDone } : t);
    case UPDATE_TASK:
      return state.map(t => t.id === action.payload.id ? { ...t, description: action.payload.description } : t);
    default:
      return state;
  }
}

function filterReducer(state = 'all', action) {
  switch (action.type) {
    case SET_FILTER:
      return action.payload;
    default:
      return state;
  }
}

const rootReducer = combineReducers({ tasks: tasksReducer, filter: filterReducer });
const store = createStore(rootReducer);

// Components
function AddTask() {
  const [text, setText] = React.useState('');
  const dispatch = useDispatch();

  const onAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const task = { id: Date.now(), description: trimmed, isDone: false };
    dispatch(addTask(task));
    setText('');
  };

  return React.createElement('div', { className: 'controls' },
    React.createElement('input', { type: 'text', value: text, onChange: e => setText(e.target.value), placeholder: 'New task description' }),
    React.createElement('button', { onClick: onAdd }, 'Add')
  );
}

function Task({ task }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(task.description);

  React.useEffect(() => { setValue(task.description); }, [task.description]);

  return React.createElement('div', { className: 'task' },
    React.createElement('input', { type: 'checkbox', checked: task.isDone, onChange: () => dispatch(toggleTask(task.id)) }),
    editing ? React.createElement('input', { type: 'text', value, onChange: e => setValue(e.target.value) }) : React.createElement('div', { className: task.isDone ? 'done' : '', style: {flex:1} }, task.description),
    editing
      ? React.createElement(React.Fragment, null,
          React.createElement('button', { onClick: () => { dispatch(updateTask(task.id, value.trim())); setEditing(false); } }, 'Save'),
          React.createElement('button', { onClick: () => { setEditing(false); setValue(task.description); } }, 'Cancel')
        )
      : React.createElement(React.Fragment, null,
          React.createElement('button', { onClick: () => setEditing(true) }, 'Edit')
        )
  );
}

function ListTask() {
  const tasks = useSelector(s => s.tasks);
  const filter = useSelector(s => s.filter);
  const dispatch = useDispatch();

  const filtered = tasks.filter(t => {
    if (filter === 'done') return t.isDone;
    if (filter === 'not') return !t.isDone;
    return true;
  });

  return React.createElement('div', null,
    React.createElement('div', { className: 'controls' },
      React.createElement('span', null, 'Filter: '),
      React.createElement('button', { onClick: () => dispatch(setFilter('all')) }, 'All'),
      React.createElement('button', { onClick: () => dispatch(setFilter('done')) }, 'Done'),
      React.createElement('button', { onClick: () => dispatch(setFilter('not')) }, 'Not Done')
    ),
    React.createElement('div', null,
      filtered.length === 0 ? React.createElement('div', null, 'No tasks') : filtered.map(t => React.createElement(Task, { key: t.id, task: t }))
    )
  );
}

function App() {
  return React.createElement('div', null,
    React.createElement(AddTask, null),
    React.createElement(ListTask, null)
  );
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(
  React.createElement(Provider, { store }, React.createElement(App, null))
);
