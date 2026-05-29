
function updateClock() {
  document.getElementById("clock").innerText =
    new Date().toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();


const quotes = [
  "small progress is still progress.",
  "discipline creates freedom.",
  "study now, glow later.",
  "dream big. Start small.",
  "success starts with consistency.",
  "you are capable of more than you think."
];
function generateQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  document.getElementById("quote").innerText = quotes[random];
}
generateQuote();


let xp = parseInt(localStorage.getItem("xp")) || 0;
let playerLevel = parseInt(localStorage.getItem("playerLevel")) || 1;

function updateXPUI() {
  document.getElementById("xp").innerText = xp;
  document.getElementById("level").innerText = playerLevel;
  document.getElementById("xpFill").style.width = xp + "%";
}

function gainXP(amount) {
  xp += amount;
  if (xp >= 100) {
    xp = 0;
    playerLevel++;
    alert("LEVEL UP! You are now level " + playerLevel);
  }
  localStorage.setItem("xp", xp);
  localStorage.setItem("playerLevel", playerLevel);
  updateXPUI();
  updateChart();
}

updateXPUI();


let achievements = JSON.parse(localStorage.getItem("achievements")) || [];
let tasksCompleted = parseInt(localStorage.getItem("tasksCompleted")) || 0;
let pomodorosCompleted = parseInt(localStorage.getItem("pomodorosCompleted")) || 0;

function unlockAchievement(name) {
  if (achievements.includes(name)) return;
  achievements.push(name);
  localStorage.setItem("achievements", JSON.stringify(achievements));
  renderAchievements();
  alert("Achievement unlocked: " + name);
}

function renderAchievements() {
  const container = document.getElementById("badgesContainer");
  container.innerHTML = "";
  if (achievements.length === 0) {
    container.innerHTML = "<p>No achievements yet..</p>";
    return;
  }
  achievements.forEach(badge => {
    const div = document.createElement("div");
    div.classList.add("badge");
    div.innerText = badge;
    container.appendChild(div);
  });
}
renderAchievements();

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li span").forEach(task => {
    tasks.push({
      text: task.innerText,
      completed: task.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTask(taskText, completed = false) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.innerText = taskText;
  if (completed) span.classList.add("completed");

  const btns = document.createElement("div");
  btns.classList.add("task-buttons");

  const doneBtn = document.createElement("button");
  doneBtn.innerText = "✔";
  doneBtn.onclick = () => {
    if (!span.classList.contains("completed")) {
      gainXP(10);
      tasksCompleted++;
      updateChart();
      localStorage.setItem("tasksCompleted", tasksCompleted);
      if (tasksCompleted === 1) unlockAchievement("Completed first task!");
      if (tasksCompleted === 5) unlockAchievement("5 tasks completed!");
    }
    span.classList.toggle("completed");
    saveTasks();
  };

  const delBtn = document.createElement("button");
  delBtn.innerText = "🗑";
  delBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  btns.appendChild(doneBtn);
  btns.appendChild(delBtn);
  li.appendChild(span);
  li.appendChild(btns);
  document.getElementById("taskList").appendChild(li);
  saveTasks();
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (text === "") return;
  createTask(text);
  input.value = "";
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach(task => createTask(task.text, task.completed));
}

loadTasks();
document.getElementById("addBtn").addEventListener("click", addTask);
document.getElementById("taskInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") addTask();
});


let timeLeft = 1500;
let timerRunning = false;

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;

  const timerInterval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    document.getElementById("timer").innerText = `${minutes}:${seconds}`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      timeLeft = 1500;
      document.getElementById("timer").innerText = "25:00";
      gainXP(25);
      pomodorosCompleted++;
      updateChart();
      localStorage.setItem("pomodorosCompleted", pomodorosCompleted);
      if (pomodorosCompleted === 1) unlockAchievement("First pomodoro!");
      if (pomodorosCompleted === 5) unlockAchievement("Deep focus master!");
      alert("study session complete! +25 XP");
    }
  }, 1000);
}

document.getElementById("startBtn").addEventListener("click", startTimer);


document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const btn = document.getElementById("themeToggle");
  btn.innerText = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
});

document.getElementById("focusToggle").addEventListener("click", () => {
  document.body.classList.toggle("focus-mode");
  const btn = document.getElementById("focusToggle");
  btn.innerText = document.body.classList.contains("focus-mode") ? "Exit Focus" : "Focus Mode";
});

const dashboard = document.getElementById("dashboard");
Sortable.create(dashboard, {
  animation: 300,
  ghostClass: "sortable-ghost",
  chosenClass: "sortable-chosen"
});


const ctx = document.getElementById("studyChart");
const studyChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Tasks Done", "Pomodoros", "Level"],
    datasets: [{
      label: "Progress",
      data: [tasksCompleted, pomodorosCompleted, playerLevel],  // FIX: was PlayerLevel
      backgroundColor: ["#ff4f87", "#ff9eb5", "#ffcce0"],
      borderRadius: 8,
      borderWidth: 0
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});

function updateChart() {
  studyChart.data.datasets[0].data = [tasksCompleted, pomodorosCompleted, playerLevel];
  studyChart.update();
}


function setTheme(theme) {
  document.body.classList.remove("pink-theme", "cyber-theme", "academia-theme", "lavender-theme");
  document.body.classList.add(theme + "-theme");
  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme || "pink");


(function initNotes() {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  const input = document.getElementById("noteInput");
  const btn = document.getElementById("addNoteBtn");
  const container = document.getElementById("notesContainer");

  function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function renderNotes() {
    container.innerHTML = "";
    notes.forEach((note, index) => {
      const div = document.createElement("div");
      div.classList.add("note");
      div.innerHTML = `
        <button onclick="window.deleteNote(${index})">❌</button>
        <p>${note}</p>
      `;
      container.appendChild(div);
    });
  }

  function addNote() {
    const text = input.value.trim();
    if (!text) return;
    notes.push(text);
    saveNotes();
    renderNotes();
    input.value = "";
  }

  window.deleteNote = function(index) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
  };

  btn.addEventListener("click", addNote);
  renderNotes();
})();

(function initPlanner() {
  let plans = JSON.parse(localStorage.getItem("plans")) || [];
  const textInput = document.getElementById("plannerText");
  const dateInput = document.getElementById("plannerDate");
  const addBtn = document.getElementById("addPlannerBtn");
  const container = document.getElementById("plannerContainer");

  function savePlans() {
    localStorage.setItem("plans", JSON.stringify(plans));
  }

  function renderPlans() {
    container.innerHTML = "";
    plans.forEach((plan, index) => {   
      const div = document.createElement("div");
      div.classList.add("plan");
      div.innerHTML = `
        <div class="plan-info">
          <strong>${plan.text}</strong>
          <span class="plan-date">${plan.date}</span>
        </div>
        <button onclick="window.deletePlan(${index})">❌</button>
      `;                                 
      container.appendChild(div);
    });
  }

  function addPlan() {
    const text = textInput.value.trim();
    const date = dateInput.value;
    if (!text || !date) return;
    plans.push({ text, date });
    savePlans();
    renderPlans();                      
    textInput.value = "";
    dateInput.value = "";
  }

  window.deletePlan = function(index) {
    plans.splice(index, 1);
    savePlans();
    renderPlans();                       
  };

  addBtn.addEventListener("click", addPlan);
  renderPlans();
})();

function markStudyDay() {
  const today = new Date().toDateString();
  const lastStudied = localStorage.getItem("lastStudied");
  let streak = parseInt(localStorage.getItem("streak")) || 0;

  if (lastStudied === today) {
    document.getElementById("streakMessage").innerText = "Already logged today! Keep it up ";
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastStudied === yesterday.toDateString()) {
    streak++;
  } else {
    streak = 1;
  }

  localStorage.setItem("streak", streak);
  localStorage.setItem("lastStudied", today);
  document.getElementById("streakCount").innerText = streak;
  document.getElementById("streakMessage").innerText = `Great work! 🔥 ${streak} day streak!`;

  if (streak === 3) unlockAchievement("3-day streak!");
  if (streak === 7) unlockAchievement("Week warrior!");
}


(function loadStreak() {
  const streak = parseInt(localStorage.getItem("streak")) || 0;
  document.getElementById("streakCount").innerText = streak;
  if (streak > 0) {
    document.getElementById("streakMessage").innerText = `🔥 ${streak} day streak!`;
  }
})();

// =========================
// WEATHER WIDGET
// =========================

async function loadWeather() {

  const apiKey = "c0c93606865bde03f6689b27dd000ef0";

  const city = "Karachi";

  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {

    const response = await fetch(url);

    const data = await response.json();

    const widget =
      document.getElementById("weatherWidget");

    widget.innerHTML = `

      <div class="weather-temp">
        ${Math.round(data.main.temp)}°C
      </div>

      <p>
        ${data.weather[0].main}
      </p>

      <p>
        📍 ${data.name}
      </p>
    `;

  } catch (error) {

    console.log(error);

    document.getElementById(
      "weatherWidget"
    ).innerHTML =
      "<p>Weather failed to load.</p>";
  }

}

loadWeather();