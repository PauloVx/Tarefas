import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public state = 'list';
  public colorMode = localStorage.getItem('colorMode');

  public todos: Array<Todo> = [];
  public title: String = 'Tarefas';
  public createTodoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createTodoForm = this.fb.group({
      title: ['', Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(60),
        Validators.required
      ])],
    })

    const stateData = JSON.stringify(this.state);
    localStorage.setItem('state', stateData);

    if(!this.colorMode) localStorage.setItem('colorMode', 'light');
    else this.loadColorMode();

    this.applyColorMode();

    this.loadData();
  }

  addTodo() {
    const title = this.createTodoForm.controls['title'].value;
    const id = this.todos.length + 1;

    const todo = new Todo(id, title, false);
    this.todos.push(todo);
    this.saveData();
    this.clearForm();
    this.state = 'list';
  }

  markTodoAsDone(todo: Todo) {
    todo.done = true;
    this.saveData();
  }

  markTodoAsUndone(todo: Todo) {
    todo.done = false;
    this.saveData();
  }

  deleteTodo(todo: Todo) {
    const index = this.todos.indexOf(todo);

    if(index === -1) return;

    this.todos.splice(index, 1);
    this.saveData();
  }

  clearForm() {
    this.createTodoForm.reset();
  }

  saveData() {
    const data = JSON.stringify(this.todos);
    localStorage.setItem('todos', data);
  }

  changeState(state: string) {
    this.state = state;
  }

  changeColorMode(mode: string) {
    this.colorMode = mode;
    localStorage.setItem('colorMode', mode);

    this.applyColorMode();
  }

  loadColorMode() {
    const mode = localStorage.getItem('colorMode');
    if(!mode) return;

    this.colorMode = mode;
  }

  applyColorMode() {
    const htmlTag = document.querySelector('html');

    if(this.colorMode === 'dark') htmlTag?.classList.add('dark-mode');
    else htmlTag?.classList.remove('dark-mode');
  }

  loadData() {
    const data = localStorage.getItem('todos');
    if(!data) return;
    this.todos = JSON.parse(data);
  }
}
