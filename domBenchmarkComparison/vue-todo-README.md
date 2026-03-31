Vue3 To-Do implementation (source only):

`App.vue`:
<template>
  <div id="app" style="max-width:600px;margin:auto;">
    <h1>Vue Todo</h1>
    <form @submit.prevent="addOrUpdate">
      <input v-model="task.name" placeholder="Task name" />
      <select v-model="task.priority">
        <option>Low</option><option>Medium</option><option>High</option>
      </select>
      <button>{{ task.id ? 'Update' : 'Add' }}</button>
    </form>

    <p>Total: {{ tasks.length }}</p>
    <ul>
      <li v-for="t in tasks" :key="t.id">
        {{ t.name }} ({{ t.priority }})
        <button @click="edit(t)">Edit</button>
        <button @click="remove(t.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const tasks = reactive([
  { id: 1, name: 'Task A', priority: 'High' },
  { id: 2, name: 'Task B', priority: 'Medium' }
]);

const task = reactive({ id: null, name: '', priority: 'Low' });

const addOrUpdate = () => {
  if (!task.name.trim()) return;
  if (task.id) {
    const idx = tasks.findIndex((t) => t.id === task.id);
    if (idx !== -1) {
      tasks[idx] = { ...task };
    }
  } else {
    tasks.push({ id: Date.now(), name: task.name, priority: task.priority });
  }
  task.id = null; task.name = ''; task.priority = 'Low';
};

const edit = (t) => { task.id = t.id; task.name = t.name; task.priority = t.priority; };
const remove = (id) => { const idx = tasks.findIndex((t) => t.id === id); if (idx > -1) tasks.splice(idx, 1); };
</script>

Benchmark note: Use `performance.now()` around `tasks = ...` and `tasks.splice(...)` operations in methods.
