function updateClock() {
  const now = new Date();
  document.getElementById("clock").innerText =
    now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();

const quotes = [
  "Small progress is still progress.",
  "Discipline creates freedom.",
  "Study now, glow later.",
  "Dream big. Start small.",
  "Success starts with consistency.",
  "You are capable of more than you think."
];
function generateQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  document.getElementById("quote").innerText = quotes[random];
}

generateQuote();
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

  if (completed) {
    span.classList.add("completed");
  }

  const btns = document.createElement("div");
  btns.classList.add("task-buttons");

  
  const doneBtn = document.createElement("button");
  doneBtn.innerText = "✔";
  doneBtn.onclick = () => {

  if (!span.classList.contains("completed")) {

    gainXP(10);
    tasksCompleted++;
    updateChart();
    localStorage.setItem(
      "tasksCompleted",
      tasksCompleted
    );
    if(tasksCompleted===1){
      unlockAchievement("Completed first task!");
    }
    if(tasksCompleted===5){
      unlockAchievement("5 tasks completed!");
    }

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
document.getElementById("addBtn")
  .addEventListener("click", addTask);

document.getElementById("taskInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") addTask();
  });
let timeLeft = 1500;
let timerRunning = false;

function startTimer() {
  if (timerRunning) return;

  timerRunning = true;

  const timer = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("timer").innerText =
      `${minutes}:${seconds}`;

    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timer);
      timerRunning = false;
      gainXP(25);
      pomodorosCompleted++;
      updateChart();
      localStorage.setItem(
        "pomodorosCompleted",
        pomodorosCompleted
      );
      if(pomodorosCompleted===1){
        unlockAchievement("first pomodoro!");
      }
      if(pomodorosCompleted===5){
        unlockAchievement("deep focus master!");
      }

     alert("✨ Study session complete! +25 XP");
    }
  }, 1000);
}

document.getElementById("startBtn")
  .addEventListener("click", startTimer);
document.getElementById("themeToggle")
  .addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const btn = document.getElementById("themeToggle");

    if (document.body.classList.contains("dark-mode")) {
      btn.innerText = "Light Mode";
    } else {
      btn.innerText = "Dark Mode";
    }
  });
window.addEventListener("DOMContentLoaded", () => {

  const focusToggle = document.getElementById("focusToggle");

  if (!focusToggle) {
    console.log("Focus button not found");
    return;
  }

  focusToggle.addEventListener("click", () => {

    document.body.classList.toggle("focus-mode");

    if (document.body.classList.contains("focus-mode")) {
      focusToggle.innerText = "Exit Focus";
    } else {
      focusToggle.innerText = " Focus Mode";
    }

  });

});
const dashboard=document.getElementById("dashboard");
Sortable.create(dashboard,{
  animation:300,
  ghostClass:"sortable-ghost",
  chosenClass:"sortable-chosen"
});
let xp = parseInt(localStorage.getItem("xp")) || 0;

let playerLevel =
  parseInt(localStorage.getItem("playerLevel")) || 1;

function updateXPUI() {

  document.getElementById("xp").innerText = xp;

  document.getElementById("level").innerText =
    playerLevel;

  const fill =
    document.getElementById("xpFill");

  fill.style.width = xp + "%";
}

function gainXP(amount) {

  xp += amount;

  if (xp >= 100) {

    xp = 0;

    playerLevel++;

    alert(
      " LEVEL UP! You are now level " +
      playerLevel
    );
  }

  localStorage.setItem("xp", xp);

  localStorage.setItem("playerLevel", playerLevel);

  updateXPUI();
  updateChart();
}

updateXPUI();
let achievements=
JSON.parse(localStorage.getItem("achievements"))||
[];
let tasksCompleted=
parseInt(localStorage.getItem("tasksCompleted"))||
0;
let pomodorosCompleted=
parseInt(localStorage.getItem("pomodorosCompleted"))||
0;
function unlockAchievement(name)
{
  if(achievements.includes(name))
    return;
  achievements.push(name);
  localStorage.setItem("achievements",
    JSON.stringify(achievements)
  );
  renderAchievements();
  alert("achievement unlocked:"+name);
}
function renderAchievements(){
  const container=
  document.getElementById("badgesContainer");
  container.innerHTML="";
  if(achievements.length===0){
    container.innerHTML=
    "<p>no achievements yet..</p>";
    return;
  }
  achievements.forEach(badge=>{
    const div=
    document.createElement("div");
    div.classList.add("badge");
    div.innerText=badge;
    container.appendChild(div);
  });
}
renderAchievements();
const ctx=
document.getElementById("studyChart");
const studyChart=new Chart(ctx,{
  type:"bar",
  data:{
    labels:[
      "Tasks",
      "Pomodoros",
      "Level"
    ],
    datasets:[{
      label:"Progress",
      data:[
        tasksCompleted,
        pomodorosCompleted,
        PlayerLevel
      ],
      borderWidth:1
    }]
  },
  options:{
    responsive:true,
    scales:{
      y:{
        beginAtZero:true
      }
    }
  }
});
function updateChart(){
  studyChart.data.datasets[0].data=[
    tasksCompleted,
    pomodorosCompleted,
    playerLevel
  ];
  studyChart.update();
}
// =========================
// THEME CUSTOMIZER
// =========================

function setTheme(theme) {

  document.body.classList.remove(
    "pink-theme",
    "cyber-theme",
    "academia-theme",
    "lavender-theme"
  );

  if (theme === "pink") {
    document.body.classList.add("pink-theme");
  }

  if (theme === "cyber") {
    document.body.classList.add("cyber-theme");
  }

  if (theme === "academia") {
    document.body.classList.add("academia-theme");
  }

  if (theme === "lavender") {
    document.body.classList.add("lavender-theme");
  }

  localStorage.setItem("theme", theme);
}


// LOAD SAVED THEME

const savedTheme =
  localStorage.getItem("theme");

if (savedTheme) {

  setTheme(savedTheme);

} else {

  setTheme("pink");
}