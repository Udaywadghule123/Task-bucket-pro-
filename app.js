const addTodoBtn = document.getElementById("addTodoBtn")
const inputTag = document.getElementById("todoInput")
const todoListUl = document.getElementById("todoList")
const itemsLeftSpan = document.getElementById("itemsLeft")
const clearCompletedBtn = document.getElementById("clearCompletedBtn")
const filterButtons = document.querySelectorAll(".filter-btn")

let todoText;
let todos = [];
let todosString = localStorage.getItem("todos")
let currentFilter = "all"   // "all" | "active" | "completed"

//if we have to dos in the local storage, we will read it
if (todosString) {
    todos = JSON.parse(todosString);
}

const updateItemsLeft = () => {
    const activeCount = todos.filter((todo) => !todo.isCompleted).length;
    itemsLeftSpan.textContent = `${activeCount} item${activeCount === 1 ? "" : "s"} left`;
}

const populateTodos = () => {
    let visibleTodos = todos;
    if (currentFilter === "active") {
        visibleTodos = todos.filter((todo) => !todo.isCompleted);
    } else if (currentFilter === "completed") {
        visibleTodos = todos.filter((todo) => todo.isCompleted);
    }

    let string = "";
    for (const todo of visibleTodos) {
        const actualIndex = todos.indexOf(todo);   // real position in `todos`, not in the filtered view
        string += `<li class="todo-item ${todo.isCompleted ? "completed" : ""}" data-index="${actualIndex}">
                    <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? "checked" : ""}>
                    <span class="todo-text">${todo.title}</span>
                    <button class="delete-btn">×</button>
                    </li>`
    }
    todoListUl.innerHTML = string;
    updateItemsLeft();
}

addTodoBtn.addEventListener("click", () => {
    todoText = inputTag.value.trim()
    if (todoText === "") return   // ignore blank todos
    inputTag.value = ""

    let todo = {
        title: todoText,
        isCompleted: false
    }
    todos.push(todo)
    localStorage.setItem("todos", JSON.stringify(todos))
    populateTodos();
})

// Enter key also adds a todo
inputTag.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTodoBtn.click();
    }
})

// one listener on the list handles BOTH checkbox and delete clicks,
// for every todo — including ones added later
todoListUl.addEventListener("click", (e) => {
    const li = e.target.closest(".todo-item")
    if (!li) return
    const index = Number(li.dataset.index)

    if (e.target.classList.contains("todo-checkbox")) {
        todos[index].isCompleted = e.target.checked
        localStorage.setItem("todos", JSON.stringify(todos))
        populateTodos()
    } else if (e.target.classList.contains("delete-btn")) {
        todos.splice(index, 1)
        localStorage.setItem("todos", JSON.stringify(todos))
        populateTodos()
    }
})

clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter((todo) => !todo.isCompleted)
    localStorage.setItem("todos", JSON.stringify(todos))
    populateTodos()
})

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter
        filterButtons.forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")
        populateTodos()
    })
})

populateTodos()