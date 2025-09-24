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

  // Set deadline ke hari ini jika kosong
  let deadlineValue = datetimeLocal.value;
  if (!deadlineValue) {
    const now = new Date();
    deadlineValue = now.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  }

  const taskObj = {
    id,
    text: tasksInput.value.trim(),
    priority: priority.value,
    deadline: deadlineValue,
    status: "todo",
    createdAt: new Date().toISOString().slice(0, 10), // simpan tanggal pembuatan
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
function renderTasks(filter = null) {
  todolist.innerHTML = "";
  doneList.innerHTML = "";

  let filteredTasks = tasks;

  if (filter) {
    filteredTasks = tasks.filter((t) => t.createdAt === filter);
  }

  filteredTasks.forEach((task) => {
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

    if (isOverdue) li.classList.add("overdue");

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

    const checkbox = li.querySelector("input[type='checkbox']");
    const span = li.querySelector("span");
    checkbox.addEventListener("change", function () {
      task.status = this.checked ? "done" : "todo";
      span.classList.toggle("done", this.checked);
      saveTasks();
      renderTasks(filterDate.value);
    });

    li.dataset.id = task.id;

    if (task.status === "done") doneList.appendChild(li);
    else todolist.appendChild(li);
  });
}

const filterDate = document.getElementById("filterDate");

filterDate.addEventListener("change", () => {
  renderTasks(filterDate.value);
});
const resetFilter = document.getElementById("resetFilter");

// Set default ke hari ini
const today = new Date().toISOString().slice(0, 10);
filterDate.value = today;

// Render tasks hanya hari ini saat load
renderTasks(today);

filterDate.addEventListener("change", () => {
  const selected = filterDate.value;
  renderTasks(selected ? selected : null);
});

resetFilter.addEventListener("click", () => {
  filterDate.value = "";
  renderTasks(null);
});

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
const profileIcon = document.getElementById("profileIcon");
const profileDropdown = document.getElementById("profileDropdown");

profileIcon.addEventListener("click", () => {
  // Toggle tampilan dropdown
  profileDropdown.style.display =
    profileDropdown.style.display === "block" ? "none" : "block";
});

// Klik luar modal -> tutup
window.addEventListener("click", (e) => {
  // tutup profile dropdown
  if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
    profileDropdown.style.display = "none";
  }
  if (e.target === confirmModal) {
    confirmModal.style.display = "none";
  }
});
