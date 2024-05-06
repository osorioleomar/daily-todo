// Todo list array
let todos = [];

// Completed list array
let completedTodos = [];

// Load todos from localStorage on page load
document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("todos")) {
      todos = JSON.parse(localStorage.getItem("todos"));
    }
    if (localStorage.getItem("completedTodos")) {
      completedTodos = JSON.parse(localStorage.getItem("completedTodos"));
    }
    renderTodos();
  });
  
  // Function to save todos to localStorage
  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
  }
  
// Function to add a new todo
function addTodo() {
    const todoInput = document.getElementById("todoInput");
    const todoText = todoInput.value.trim();
    
    if (todoText !== "") {
      todos.push({ text: todoText, timeSpent: 0, timer: null });
      renderTodos();
      saveTodos();
      todoInput.value = "";
    }
  }

  // Function to save todos to localStorage
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
  }

// Function to export todos as JSON file
function exportTodos() {
    const todosData = JSON.stringify({ todos, completedTodos });
    const blob = new Blob([todosData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todos.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // Function to import todos from JSON file
  function importTodos(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
      const data = JSON.parse(event.target.result);
      todos = data.todos || [];
      completedTodos = data.completedTodos || [];
      renderTodos();
      saveTodos();
    };
    reader.readAsText(file);
  }
  
// Function to clear all todos
function clearTodos() {
    if (confirm("This will empty all your list below. Proceed?")) {
      todos = [];
      completedTodos = [];
      renderTodos();
      saveTodos();
    }
  }
  
  // Function to start timer
  function startTimer(index) {
    const todo = todos[index];
    if (!todo.timer) {
      todo.timer = setInterval(() => {
        todo.timeSpent++;
        renderTodos();
        saveTodos(); // Save todos to localStorage
      }, 1000);
      renderTodos();
      saveTodos(); // Save todos to localStorage
    }
  }
  
  // Function to pause timer
  function pauseTimer(index) {
    const todo = todos[index];
    if (todo.timer) {
      clearInterval(todo.timer);
      todo.timer = null;
      saveTodos(); // Save todos to localStorage
    }
  }
  
  // Function to stop timer
  function stopTimer(index) {
    const todo = todos[index];
    if (todo.timer) {
      clearInterval(todo.timer);
      todo.timer = null;
      const completedTodo = { ...todo, timeSpent: todo.timeSpent };
      completedTodos.push(completedTodo);
      todos.splice(index, 1);
      renderTodos();
      saveTodos(); // Save todos to localStorage
    }
  }
  
  // Function to mark todo as completed
  function completeTodo(index) {
    completedTodos.push(todos[index]);
    todos.splice(index, 1);
    renderTodos();
    saveTodos(); // Save todos to localStorage
  }
  
  // Function to render todos
  function renderTodos() {
    const todoList = document.getElementById("todoList");
    const completedList = document.getElementById("completedList");
  
    todoList.innerHTML = "";
    completedList.innerHTML = "";
  
    todos.forEach((todo, index) => {
      const todoItem = document.createElement("li");
      todoItem.classList.add("todo-item");
      todoItem.innerHTML = `
        ${todo.text} (${formatTime(todo.timeSpent)})
        <div class="todo-icons">
            <button onclick="startTimer(${index})"><i class="fas fa-play"></i></button>
            <button onclick="pauseTimer(${index})"><i class="fas fa-pause"></i></button>
            <button onclick="stopTimer(${index})"><i class="fas fa-check"></i></button>
        </div>
      `;
      todoList.appendChild(todoItem);
    });
  
    completedTodos.forEach(todo => {
      const completedItem = document.createElement("li");
      completedItem.classList.add("completed-item");
      completedItem.innerHTML = `
        ${todo.text} - ${formatTime(todo.timeSpent)}
      `;
      completedList.appendChild(completedItem);
    });
  }

  // Make todo list items sortable
  new Sortable(todoList, {
    animation: 150,
    onEnd: function(event) {
      // Reorder todos array based on new list order
      const oldIndex = event.oldIndex;
      const newIndex = event.newIndex;
      const movedTodo = todos.splice(oldIndex, 1)[0];
      todos.splice(newIndex, 0, movedTodo);
      renderTodos();
      saveTodos();
    }
  });
  
  // Function to format time
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${padZero(minutes)}:${padZero(secs)}`;
  }
  
  // Function to add leading zero to single digit numbers
  function padZero(num) {
    return (num < 10 ? "0" : "") + num;
  }
  