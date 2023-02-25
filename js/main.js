import api from "./api.js";

const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");


const tasks = api.fetchTasks()
 renderTask(tasks);

document.body.addEventListener("click", (e) => {
  if (e.target.dataset.action === "add-task") {
    addTask(e);
    return;
  }
  if (e.target.dataset.action === "clear-all") {
    clearAll(e);
    return;
  }
  if (e.target.dataset.action === "delete") {
    deleteTask(e);
    return;
  }
  if (e.target.dataset.action === "done") {
    doneTask(e);
    return;
  }
  if (e.target.dataset.action === "edit") {
    editTask(e);
    return;
  }
});

function addTask(event) {
  const taskText = taskInput.value;

  const newTask = {
		id: Date.now(),
		title: taskText,
		completed: false,
  }

  taskInput.value = "";
  taskInput.focus();

  const newTaskHtml = taskItem(newTask);
  tasksList.insertAdjacentHTML("beforeend", newTaskHtml);

 api.addTaskItem(newTask);
}

function editTask(e) {
  const parentNode = e.target.closest(".list-group-item");

  const titleTask = parentNode.querySelector("#titleTask");
  const editInputTask = parentNode.querySelector("#editInputTask");

  titleTask.classList.toggle("none");
  editInputTask.classList.toggle("none");

  titleTask.innerHTML = editInputTask.value;

 	api.updateTaskItem({
    id: Number(parentNode.dataset.id),
     title: editInputTask.value,
  });
}

function doneTask(event) {
  const parentNode = event.target.closest(".list-group-item");

  const id = Number(parentNode.id);

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");

  const completed = parentNode.dataset.completed === "true";
  parentNode.dataset.completed = completed;

api.updateTaskItem({
    id,
    userId: 2,
    completed: !completed,
  });
}

function deleteTask(event) {
  const parentNode = event.target.closest(".list-group-item");
  const id = Number(parentNode.id);

  parentNode.remove();
	api.deleteTask(id);
}

function clearAll() {
  tasksList.innerHTML = "";
}

function taskItem(task) {
  const cssClass = task.completed
    ? "task-title task-title--done"
    : "task-title";
  return `
		<li id="${task.id}" data-id="${task.id}" data-completed="${task.completed}" class="list-group-item d-flex justify-content-between task-item">
			<span id="titleTask" class="${cssClass}">${task.title}</span>

      <input id="editInputTask"  class="none" type="text" value="${task.title}" />
			<div class="task-item__buttons">
        <button type="button" data-action="edit" class="btn-action">
					<img src="./img/leaf.svg" alt="Done" width="18" height="18">
				</button>
				<button type="button" data-action="done" class="btn-action">
					<img src="./img/tick.svg" alt="Done" width="18" height="18">
				</button>
				<button type="button" data-action="delete" class="btn-action">
					<img src="./img/cross.svg" alt="Done" width="18" height="18">
				</button>
			</div>
		</li>`;
}

function renderTask(tasks = []) {
  if (tasks.length === 0) {
    const emptyListHTML = `
		<li id="emptyList" class="list-group-item empty-list">
			<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
			<div class="empty-list__title">Список дел пуст</div>
		</li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  const tasksHTML = tasks.map((task) => taskItem(task));

  tasksList.insertAdjacentHTML("beforeend", tasksHTML.join(""));
}