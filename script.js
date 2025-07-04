const LoveNotes = [
  "Just a reminder: I'm in your corner, always.",
  "No matter the progress — you’re already beautiful to me.",
  "You’re doing better than you think, I’m so proud of you ❤️",
  "The effort you put in every day makes me love you even more.",
  "This app isn’t perfect — but it’s made with love for someone who is."
];

const quotes = [
  "Progress, not perfection 💪",
  "You are becoming stronger every day 💖",
  "Trust the process, it's working ✨",
  "Be proud of yourself today 🌸",
  "You’re doing better than you think 💫",
];

// 🎉 Confetti
function shouldShowConfetti() {
  const lastShown = localStorage.getItem("confettiShownDate");
  const today = new Date().toISOString().split("T")[0];
  return lastShown !== today;
}

function markConfettiShown() {
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("confettiShownDate", today);
}

function launchConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  (function frame() {
    if (Date.now() > end) return;
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 }
    });
    requestAnimationFrame(frame);
  })();
}

// 💬 Quote Rotator
function rotateQuotes() {
  const box = document.getElementById("quoteBox");
  let quoteIndex = 0;
  box.textContent = quotes[quoteIndex];

  setInterval(() => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    box.classList.remove("fade-in");
    void box.offsetWidth;
    box.textContent = quotes[quoteIndex];
    box.classList.add("fade-in");
  }, 6000);
}

// 💖 Name Modal
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
    modal.classList.add("hidden");
    document.getElementById("title").textContent = `You Got This, ${herName} 💖`;
  }
}

// 📅 Week Calculation
function getWeekNumber(d) {
  const z = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = z.getUTCDay() || 7;
  z.setUTCDate(z.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(z.getUTCFullYear(),0,1));
  return Math.ceil((((z - yearStart) / 86400000) + 1)/7);
}

// ✅ Entry Save Logic
function saveEntry() {
  const val = document.getElementById('entryInput').value;
  if (!val) return;
  const week = 'Wk ' + getWeekNumber(new Date());
  let data = JSON.parse(localStorage.getItem('entries') || '{}');
  data[week] = val;
  localStorage.setItem('entries', JSON.stringify(data));
  document.getElementById('entryInput').value = '';
  renderEntries();

  if (shouldShowConfetti()) {
    launchConfetti();
    markConfettiShown();
  }
}

// 📋 Render Saved Entries
function renderEntries() {
  const list = document.getElementById('entriesList');
  const data = JSON.parse(localStorage.getItem('entries') || '{}');
  list.innerHTML = '';
  Object.entries(data).forEach(([week, val]) => {
    const li = document.createElement('li');
    li.textContent = `${week}: ${val}`;
    list.appendChild(li);
  });
}

// 💌 Daily Note
function loadLoveNote() {
  const stored = JSON.parse(localStorage.getItem('todayNote') || '{}');
  const today = new Date().toISOString().slice(0,10);
  if (stored.date === today) {
    showNote(stored.note);
  } else {
    const note = LoveNotes[Math.floor(Math.random() * LoveNotes.length)];
    localStorage.setItem('todayNote', JSON.stringify({date:today, note}));
    showNote(note);
  }
}

function showNote(note) {
  document.querySelector('#message p').textContent = note;
}

// 🚀 INIT
document.addEventListener('DOMContentLoaded', () => {
  loadName();
  rotateQuotes();
  loadLoveNote();
  renderEntries();

  const btn = document.getElementById('saveEntry');
  if (btn) {
    btn.addEventListener('click', saveEntry);
  }
});
