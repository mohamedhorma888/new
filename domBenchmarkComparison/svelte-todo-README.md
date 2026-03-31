Svelte To-Do implementation (source only):

`App.svelte`:
<script>
  let tasks = [
    { id: 1, name: 'Task A', priority: 'High' },
    { id: 2, name: 'Task B', priority: 'Medium' }
  ];
  let form = { id: null, name: '', priority: 'Low' };

  function addOrUpdate() {
    if (!form.name.trim()) return;
    if (form.id) {
      tasks = tasks.map((t) => (t.id === form.id ? { ...form } : t));
    } else {
      tasks = [...tasks, { ...form, id: Date.now() }];
    }
    form = { id: null, name: '', priority: 'Low' };
  }

  function edit(task) { form = { ...task }; }
  function remove(id) { tasks = tasks.filter((t) => t.id !== id); }
</script>

<main style="max-width:600px;margin:auto;">
  <h1>Svelte Todo</h1>
  <form on:submit|preventDefault={addOrUpdate}>
    <input bind:value={form.name} placeholder="Task name" />
    <select bind:value={form.priority}>
      <option>Low</option><option>Medium</option><option>High</option>
    </select>
    <button>{form.id ? 'Update' : 'Add'}</button>
  </form>

  <ul>
    {#each tasks as t (t.id)}
      <li>
        {t.name} ({t.priority})
        <button on:click={() => edit(t)}>Edit</button>
        <button on:click={() => remove(t.id)}>Delete</button>
      </li>
    {/each}
  </ul>
</main>

Benchmark note: use `performance.now()` around assignments in `addOrUpdate`/`remove` and `edit` to measure runtime.
