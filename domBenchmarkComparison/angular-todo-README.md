Angular To-Do implementation (source only):

1) `app.component.ts`:

import { Component } from "@angular/core";

interface Task { id: number; name: string; priority: "Low" | "Medium" | "High"; }

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  tasks: Task[] = [
    { id: 1, name: "Task A", priority: "High" },
    { id: 2, name: "Task B", priority: "Medium" }
  ];

  model: Task = { id: 0, name: "", priority: "Low" };

  addOrUpdate() {
    if (!this.model.name.trim()) return;
    if (this.model.id) {
      this.tasks = this.tasks.map((t) => t.id === this.model.id ? { ...this.model } : t);
    } else {
      this.tasks = [...this.tasks, { ...this.model, id: Date.now() }];
    }
    this.model = { id: 0, name: "", priority: "Low" };
  }

  edit(task: Task) { this.model = { ...task }; }

  remove(id: number) { this.tasks = this.tasks.filter((t) => t.id !== id); }
}

2) `app.component.html`:

<div style="max-width:600px;margin:auto;">
  <h1>Angular Todo</h1>
  <form (ngSubmit)="addOrUpdate()">
    <input [(ngModel)]="model.name" name="name" placeholder="Task name" />
    <select [(ngModel)]="model.priority" name="priority">
      <option>Low</option><option>Medium</option><option>High</option>
    </select>
    <button type="submit">{{ model.id ? 'Update' : 'Add' }}</button>
  </form>

  <ul>
    <li *ngFor="let t of tasks">
      {{ t.name }} ({{ t.priority }})
      <button (click)="edit(t)">Edit</button>
      <button (click)="remove(t.id)">Delete</button>
    </li>
  </ul>
</div>

Benchmark in Angular: add measure code in component by using `performance.now` around `this.tasks = ...` transitions and optionally `NgZone.runOutsideAngular` for raw DOM time sample.
