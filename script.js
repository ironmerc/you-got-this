const checklistItems = ["Water", "Walk", "Sleep", "Meals"];
const quotes = [
  "You are stronger than you think.",
  "Progress, not perfection.",
  "You’re doing amazing 💖",
  "Every small step counts.",
  "I’m proud of you today, too.",
];

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function rotateQuotes() {
  const quoteBox = document.getElementById("quoteBox");
  if (!quoteBox) return;
  const rand = quotes[Math.floor(Math.random() * quotes.length)];
  quoteBox.textContent = rand;
}

function loadName() {
  const name = localStorage.getItem("userName");
  if (!name) {
    document.getElementById("nameModal").classList.remove("hidden");
    document.getElementById("saveName").onclick = () => {
      const nameInput = document.getElementById("nameInput").value.trim();
      if (nameInput) {
        localStorage.setItem("userName", nameInput);
        document.getElementById("nameModal").classList.add("hidden");
        location.reload();
      }
    };
  } else {
    document.getElementById("title").innerText = `You Got This, ${name} 💖`;
  }
}

function loadChecklist() {
  const data = JSON.parse(localStorage.getItem("checklist") || "{}");
  const today = getToday();
  const saved = data[today] || [];
  const checklist = document.getElementById("checklist").querySelectorAll("input[type='checkbox']");
  checklist.forEach((box, i) => {
    box.checked = saved.includes(i);
  });
}

function saveChecklist() {
  const checklist = document.getElementById("checklist").querySelectorAll("input[type='checkbox']");
  const data = JSON.parse(localStorage.getItem("checklist") || "{}");
  const today = getToday();
  data[today] = [];
  checklist.forEach((box, i) => {
    if (box.checked) data[today].push(i);
  });
  localStorage.setItem("checklist", JSON.stringify(data));
}

function updateStreak() {
  const moods = JSON.parse(localStorage.getItem("moodEntries") || "{}");
  let streak = 0;
  let day = new Date(getToday());
  while (true) {
    const key = day.toISOString().split("T")[0];
    if (moods[`mood_${key}`] !== undefined) {
      streak++;
      day.setDate(day.getDate() - 1);
    } else break;
  }
  document.getElementById("streakLine").textContent = `🔥 ${streak}-day streak`;
}

function confetti() {
  window.confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

function saveEntry() {
  const mood = parseInt(document.getElementById("moodInput").value);
  const weight = parseFloat(document.getElementById("weightInput").value);
  const today = getToday();

  if (isNaN(mood) || mood < 1 || mood > 10) {
    alert("Please enter a mood between 1 and 10 💖");
    return;
  }

  const moods = JSON.parse(localStorage.getItem("moodEntries") || "{}");
  const weights = JSON.parse(localStorage.getItem("weightEntries") || "{}");

  moods[`mood_${today}`] = mood;
  if (!isNaN(weight)) weights[`weight_${today}`] = weight;

  localStorage.setItem("moodEntries", JSON.stringify(moods));
  localStorage.setItem("weightEntries", JSON.stringify(weights));

  saveChecklist();
  renderEntries();
  updateStreak();
  checkAndAwardBadges();
  confetti();

  document.getElementById("moodInput").value = "";
  document.getElementById("weightInput").value = "";
}

function renderEntries() {
  const moodData = JSON.parse(localStorage.getItem("moodEntries") || "{}");
  const weightData = JSON.parse(localStorage.getItem("weightEntries") || "{}");
  const checklistData = JSON.parse(localStorage.getItem("checklist") || "{}");

  const today = getToday();
  const list = document.getElementById("entriesList");
  list.innerHTML = "";

  if (moodData[`mood_${today}`] !== undefined) {
    list.innerHTML += `<li>🧠 Mood: ${moodData[`mood_${today}`]}</li>`;
  }

  if (weightData[`weight_${today}`] !== undefined) {
    list.innerHTML += `<li>⚖️ Weight: ${weightData[`weight_${today}`]} kg</li>`;
  }

  if (checklistData[today]) {
    const completed = checklistData[today].map(i => checklistItems[i]).join(", ");
    list.innerHTML += `<li>✅ Checklist: ${completed}</li>`;
  }
}

// 🎖 Badge System
function awardBadge(key, emoji) {
  const badges = JSON.parse(localStorage.getItem("badges") || "[]");
  if (!badges.includes(key)) {
    badges.push(key);
    localStorage.setItem("badges", JSON.stringify(badges));
  }
}

function checkAndAwardBadges() {
  const moods = JSON.parse(localStorage.getItem("moodEntries") || "{}");
  const weights = JSON.parse(localStorage.getItem("weightEntries") || "{}");

  const moodDates = Object.keys(moods);
  const weightDates = Object.keys(weights);

  if (moodDates.length >= 1) awardBadge("firstMood", "🌟");
  if (moodDates.length >= 10) awardBadge("10moods", "🧠");
  if (weightDates.length >= 1) awardBadge("firstWeight", "⚖️");

  let streak = 0;
  let day = new Date(getToday());
  while (true) {
    const dateStr = day.toISOString().split("T")[0];
    if (moods[`mood_${dateStr}`] !== undefined) {
      streak++;
      day.setDate(day.getDate() - 1);
    } else break;
  }

  if (streak >= 3) awardBadge("streak3", "🐥");
  if (streak >= 7) awardBadge("streak7", "🔥");
}

// 🧠 Comfort Mode Toggle
function loadModeToggle() {
  const toggle = document.getElementById("modeToggle");
  const body = document.getElementById("appBody");
  const comfortBox = document.getElementById("comfortBox");

  const savedMode = localStorage.getItem("comfortMode") === "on";
  toggle.checked = savedMode;

  if (savedMode) {
    body.classList.add("glow");
    comfortBox.classList.remove("hidden");
  }

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      localStorage.setItem("comfortMode", "on");
      body.classList.add("glow");
      comfortBox.classList.remove("hidden");
    } else {
      localStorage.removeItem("comfortMode");
      body.classList.remove("glow");
      comfortBox.classList.add("hidden");
    }
  });
}


// 🔄 Init on page load
document.addEventListener('DOMContentLoaded', () => {
  loadName();
  rotateQuotes();
  renderEntries();
  loadChecklist();
  updateStreak();
  checkAndAwardBadges();
  loadModeToggle();
  document.getElementById('saveEntry').addEventListener('click', saveEntry);
});
