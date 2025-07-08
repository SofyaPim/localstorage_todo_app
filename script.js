const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

const removeSpecialChars = (val) => {
  return val.trim().replace(/[^A-Za-z0-9\-\s]/g, '')
}

const addOrUpdateTask = () => {
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${removeSpecialChars(titleInput.value).toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: removeSpecialChars(titleInput.value),
    date: dateInput.value,
    description: removeSpecialChars(descriptionInput.value),
  };
  
  
  if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  } else {
    taskData[dataArrIndex] = taskObj;
  }
  
  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer();
  reset();
//   if(!titleInput.value.trim()){
//    alert("Please provide a title");
//    return;
//  }
};

const updateTaskContainer = () => {
  tasksContainer.innerHTML = "";

  taskData.forEach(
    ({ id, title, date, description }) => {
        (tasksContainer.innerHTML += `
        <div class="task" id="${id}">
        <div class="task-container">
          <p>${title} <span class="desc-item">title</span></p>
          <p>${date ? date : 'без даты'} <span class="desc-item">deadline</span></p>
          <p>${description ? description : 'без подробностей'} <span class="desc-item">description</span></p>
         </div>
          <div class="btn-container">
          <button onclick="editTask(this)" type="button" class="btn">
          Edit 
          <svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.292893 16.3783C-0.0976311 16.7689 -0.0976311 17.402 0.292893 17.7926C0.683418 18.1831 1.31658 18.1831 1.70711 17.7926L0.292893 16.3783ZM1 17.0854L1.70711 17.7926L10.275 9.22465L9.56791 8.51754L8.8608 7.81043L0.292893 16.3783L1 17.0854Z" fill="#424242"/>
          <path d="M1.79549 0.292893C1.40496 -0.0976311 0.771796 -0.0976311 0.381272 0.292893C-0.00925217 0.683418 -0.00925217 1.31658 0.381272 1.70711L1.79549 0.292893ZM1.08838 1L0.381272 1.70711L8.94918 10.275L9.65629 9.56791L10.3634 8.8608L1.79549 0.292893L1.08838 1Z" fill="#424242"/>
          </svg>
          </button>
          <button onclick="deleteTask(this)" type="button" class="btn">
          Delete 
          <svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.292893 16.3783C-0.0976311 16.7689 -0.0976311 17.402 0.292893 17.7926C0.683418 18.1831 1.31658 18.1831 1.70711 17.7926L0.292893 16.3783ZM1 17.0854L1.70711 17.7926L10.275 9.22465L9.56791 8.51754L8.8608 7.81043L0.292893 16.3783L1 17.0854Z" fill="#424242"/>
          <path d="M1.79549 0.292893C1.40496 -0.0976311 0.771796 -0.0976311 0.381272 0.292893C-0.00925217 0.683418 -0.00925217 1.31658 0.381272 1.70711L1.79549 0.292893ZM1.08838 1L0.381272 1.70711L8.94918 10.275L9.65629 9.56791L10.3634 8.8608L1.79549 0.292893L1.08838 1Z" fill="#424242"/>
          </svg>
          </button> 
          </div>
           </div>
      `)
    }
  );
};


const deleteTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.parentElement.id
  );

  buttonEl.parentElement.parentElement.remove();
  taskData.splice(dataArrIndex, 1);
  localStorage.setItem("data", JSON.stringify(taskData));
}

const editTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.parentElement.id
  );

  currentTask = taskData[dataArrIndex];

  titleInput.value = currentTask.title;
  dateInput.value = currentTask.date;
  descriptionInput.value = currentTask.description;

  addOrUpdateTaskBtn.innerText = "Update Task";

  taskForm.classList.toggle("hidden");  
}

const reset = () => {
  addOrUpdateTaskBtn.innerText = "Add Task";
  titleInput.value = "";
  dateInput.value = "";
  descriptionInput.value = "";
  taskForm.classList.toggle("hidden");
  currentTask = {};
}

if (taskData.length) {
  updateTaskContainer();
}

openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")
);

closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;

  if (formInputsContainValues && formInputValuesUpdated) {
    confirmCloseDialog.showModal();
  } else {
    reset();
  }
});

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset()
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addOrUpdateTask();
});
