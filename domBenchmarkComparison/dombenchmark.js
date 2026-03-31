// Basic benchmark harness for DOM operations (Vanilla as baseline)
const createTask = (n) => ({ id: n, name: `Task ${n}`, priority: ["Low", "Medium", "High"][n % 3] });

export const benchmark = {
  render: (count) => {
    const container = document.createElement('div');
    const tasks = Array.from({ length: count }, (_, i) => createTask(i));

    const start = performance.now();
    container.innerHTML = `<ul>${tasks.map((t) => `<li data-id="${t.id}">${t.name} (${t.priority})</li>`).join('')}</ul>`;
    const duration = performance.now() - start;
    return duration;
  },

  update: (total, updateCount = 50) => {
    const container = document.createElement('div');
    const tasks = Array.from({ length: total }, (_, i) => createTask(i));
    container.innerHTML = `<ul>${tasks.map((t) => `<li data-id="${t.id}">${t.name} (${t.priority})</li>`).join('')}</ul>`;

    const nodes = container.querySelectorAll('li');
    const start = performance.now();
    for (let i = 0; i < updateCount; i++) {
      const node = nodes[i];
      if (node) node.textContent = `Task ${i} (High-updated)`;
    }
    return performance.now() - start;
  },

  delete: (total, deleteCount = 50) => {
    const container = document.createElement('div');
    const tasks = Array.from({ length: total }, (_, i) => createTask(i));
    container.innerHTML = `<ul>${tasks.map((t) => `<li data-id="${t.id}">${t.name} (${t.priority})</li>`).join('')}</ul>`;

    const start = performance.now();
    for (let i = 0; i < deleteCount; i++) {
      const li = container.querySelector('li');
      if (li) li.remove();
    }
    return performance.now() - start;
  },

  report: () => {
    console.log('vanilla render100:', benchmark.render(100));
    console.log('vanilla render500:', benchmark.render(500));
    console.log('vanilla render1000:', benchmark.render(1000));
    console.log('vanilla update50:', benchmark.update(1000, 50));
    console.log('vanilla delete50:', benchmark.delete(1000, 50));
  }
};

// auto-report in browser if loaded directly
if (typeof window !== 'undefined') {
  setTimeout(() => benchmark.report(), 0);
}
