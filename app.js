// Ambil elemen penting
const tasksInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const datetimeLocal = document.getElementById("dueDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const todolist = document.getElementById("todoList");
const doneList = document.getElementById("doneList");
const clearAllBtn = document.getElementById("clearAllBtn");
const currentDate = document.getElementById("currentDate");

// Elemen modal konfirmasi
const confirmModal = document.getElementById("confirmModal");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");

let tasks = [];

// Load dari localStorage saat halaman dibuka
if (localStorage.getItem("my-tasks")) {
  tasks = JSON.parse(localStorage.getItem("my-tasks"));
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("my-tasks", JSON.stringify(tasks));
}

// Tanggal & Waktu sekarang
let sekarang = new Date();
let tanggal = sekarang.getDate();
let bulan = sekarang.getMonth() + 1;
let tahun = sekarang.getFullYear();
let jam = sekarang.getHours();
let menit = sekarang.getMinutes();
let detik = sekarang.getSeconds();

currentDate.innerHTML = `${tanggal}-${bulan}-${tahun}, ${jam}:${menit}:${detik}`;

// Tambah task
addTaskBtn.addEventListener("click", function () {
  if (tasksInput.value.trim() === "") {
    alert("Data kosong!");
    return;
  }

  const id = Date.now().toString(); // id unik

  // Cek apakah user isi deadline
  let deadlineValue = datetimeLocal.value;
  if (!deadlineValue) {
    const now = new Date();
    // format biar sesuai input datetime-local (yyyy-MM-ddTHH:mm)
    deadlineValue = now.toISOString().slice(0, 16);
  }

  const taskObj = {
    id,
    text: tasksInput.value.trim(),
    priority: priority.value,
    deadline: deadlineValue,
    status: "todo",
  };

  tasks.push(taskObj);
  saveTasks();
  renderTasks();

  // reset input
  tasksInput.value = "";
  priority.value = "";
  datetimeLocal.value = "";
});

// Render task
function renderTasks() {
  todolist.innerHTML = "";
  doneList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    const deadlineText = task.deadline
      ? new Date(task.deadline).toLocaleString()
      : "Tidak ada deadline";

    // Cek overdue
    let isOverdue = false;
    if (task.status === "todo" && task.deadline) {
      const now = new Date();
      const deadlineDate = new Date(task.deadline);
      if (deadlineDate < now) {
        isOverdue = true;
      }
    }

    // Tambahkan class overdue ke <li> jika overdue
    if (isOverdue) {
      li.classList.add("overdue");
    }

    li.innerHTML = `
      <div>
        <input type="checkbox" ${task.status === "done" ? "checked" : ""} />
        <span class="${task.status === "done" ? "done" : ""}">
          ${task.text} (Priority: ${task.priority}) - Deadline: ${deadlineText}
          ${isOverdue ? "<strong style='color:red'>(Overdue!)</strong>" : ""}
        </span>
      </div>
      <button class="delete-btn">Hapus</button>
    `;

    // Checkbox handler
    const checkbox = li.querySelector("input[type='checkbox']");
    const span = li.querySelector("span");
    checkbox.addEventListener("change", function () {
      task.status = this.checked ? "done" : "todo";
      span.classList.toggle("done", this.checked);
      saveTasks();
      renderTasks();
    });

    // Simpan id ke element untuk memudahkan hapus
    li.dataset.id = task.id;

    if (task.status === "done") {
      doneList.appendChild(li);
    } else {
      todolist.appendChild(li);
    }
  });
}

// Hapus item di todoList
todolist.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const li = e.target.closest("li");
    const id = li.dataset.id;

    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
  }
});

// Hapus item di doneList
doneList.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const li = e.target.closest("li");
    const id = li.dataset.id;

    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
  }
});

// Hapus semua item
clearAllBtn.addEventListener("click", function () {
  confirmModal.style.display = "flex";
});

// Batal hapus semua
cancelBtn.addEventListener("click", () => {
  confirmModal.style.display = "none";
});

// Konfirmasi hapus semua
confirmBtn.addEventListener("click", () => {
  tasks = [];
  saveTasks();
  renderTasks();
  confirmModal.style.display = "none";
});

// Klik luar modal -> tutup
window.addEventListener("click", (e) => {
  if (e.target === confirmModal) {
    confirmModal.style.display = "none";
  }
});
