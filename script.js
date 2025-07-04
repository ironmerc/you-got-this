function getToday() {
  return new Date().toISOString().split('T')[0];
}

function saveEntry() {
  const moodVal = document.getElementById('moodInput').value.trim();
  const weightVal = document.getElementById('weightInput').value.trim();
  const today = getToday();

  if (!moodVal) {
    alert("Mood is required.");
    return;
  }

  const mood = parseInt(moodVal);
  if (mood < 1 || mood > 10) {
    alert("Mood must be between 1 and 10 🧠");
    return;
  }

  const moods = JSON.parse(localStorage.getItem('moodEntries') || '{}');
  moods[`mood_${today}`] = mood;
  localStorage.setItem('moodEntries', JSON.stringify(moods));

  if (shouldShowConfetti()) {
    launchConfetti();
    markConfettiShown();
  }

  if (weightVal) {
    const weight = parseFloat(weightVal);
    if (!isNaN(weight)) {
      const weights = JSON.parse(localStorage.getItem('weightEntries') || '{}');
      weights[`weight_${today}`] = weight;
      localStorage.setItem('weightEntries', JSON.stringify(weights));
    }
  }

  const checklistStates = Array.from(document.querySelectorAll('#checklist input[type="checkbox"]')).map(cb => cb.checked);
  localStorage.setItem(`checklist_${today}`, JSON.stringify(checklistStates));

  document.getElementById('moodInput').value = '';
  document.getElementById('weightInput').value = '';

  renderEntries();
  updateStreak();
}

function renderEntries() {
  const list = document.getElementById('entriesList');
  list.innerHTML = '';

  const moodData = JSON.parse(localStorage.getItem('moodEntries') || '{}');
  const weightData = JSON.parse(localStorage.getItem('weightEntries') || '{}');

  const allDates = new Set([
    ...Object.keys(moodData).map(k => k.replace('mood_', '')),
    ...Object.keys(weightData).map(k => k.replace('weight_', ''))
  ]);

  const moodEmoji = (m) => {
    if (m >= 9) return '😄';
    if (m >= 7) return '😊';
    if (m >= 5) return '😐';
    if (m >= 3) return '😞';
    return '😢';
  };

  [...allDates].sort().reverse().forEach(date => {
    const mood = moodData[`mood_${date}`];
    const weight = weightData[`weight_${date}`];

    if (mood !== undefined) {
      const liMood = document.createElement('li');
      liMood.textContent = `${date} - ${moodEmoji(mood)} Mood: ${mood}/10`;
      list.appendChild(liMood);
    }

    if (weight !== undefined) {
      const liWeight = document.createElement('li');
      liWeight.textContent = `${date} - ⚖️ Weight: ${weight} kg`;
      list.appendChild(liWeight);
    }
  });
}

function shouldShowConfetti() {
  return localStorage.getItem("confettiShown") !== getToday();
}
function markConfettiShown() {
  localStorage.setItem("confettiShown", getToday());
}
function launchConfetti() {
  const end = Date.now() + 1500;
  (function frame() {
    confetti({ particleCount: 20, spread: 70, origin: { y: 0.6 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function rotateQuotes() {
  const quotes = [
    "Progress, not perfection 💪",
    "You are becoming stronger every day 💖",
    "Trust the process, it's working ✨",
    "Be proud of yourself today 🌸",
    "You’re doing better than you think 💫",
  ];
  const box = document.getElementById("quoteBox");
  let i = 0;
  box.textContent = quotes[i];
  setInterval(() => {
    i = (i + 1) % quotes.length;
    box.textContent = quotes[i];
  }, 6000);
}

function loadLoveNote() {
  const notes = [
    "I believe in you — always.",
    "You’re already beautiful to me.",
    "Each small step is a win ❤️",
    "Made with love, for someone who deserves it."
  ];
  const today = getToday();
  const stored = JSON.parse(localStorage.getItem('todayNote') || '{}');
  if (stored.date === today) {
    showNote(stored.note);
  } else {
    const note = notes[Math.floor(Math.random() * notes.length)];
    localStorage.setItem('todayNote', JSON.stringify({ date: today, note }));
    showNote(note);
  }
}
function showNote(note) {
  document.querySelector('#message p').textContent = note;
}

function loadChecklist() {
  const today = getToday();
  const states = JSON.parse(localStorage.getItem(`checklist_${today}`) || '[]');
  const checkboxes = document.querySelectorAll('#checklist input[type="checkbox"]');
  checkboxes.forEach((cb, i) => cb.checked = states[i] || false);
}

function loadName() {
  const modal = document.getElementById("nameModal");
  const herName = localStorage.getItem("herName");
  if (!herName) {
    modal.classList.remove("hidden");
    document.getElementById("saveName").addEventListener("click", () => {
      const name = document.getElementById("nameInput").value.trim();
      if (name) {
        localStorage.setItem("herName", name);
        modal.classList.add("hidden");
        document.getElementById("title").textContent = `You Got This, ${name} 💖`;
      }
    });
  } else {
    document.getElementById("title").textContent = `You Got This, ${herName} 💖`;
  }
}

function updateStreak() {
  const moods = JSON.parse(localStorage.getItem('moodEntries') || '{}');
  const today = getToday();

  let streak = 0;
  let day = new Date(today);

  while (true) {
    const dateStr = day.toISOString().split('T')[0];
    if (moods[`mood_${dateStr}`] !== undefined) {
      streak++;
      day.setDate(day.getDate() - 1);
    } else {
      break;
    }
  }

  document.getElementById("streakLine").textContent = streak > 0 ? `🔥 ${streak}-day streak! Keep it up!` : "";
}

document.addEventListener('DOMContentLoaded', () => {
  loadName();
  rotateQuotes();
  loadLoveNote();
  renderEntries();
  loadChecklist();
  updateStreak();
  document.getElementById('saveEntry').addEventListener('click', saveEntry);
});
