const LoveNotes = [
  "You light up my life.",
  "Your dedication inspires me daily.",
  "I’m so proud of your progress."
];

async function loadQuote() {
  const stored = JSON.parse(localStorage.getItem('todayQuote') || '{}');
  const today = new Date().toISOString().slice(0,10);

  if (stored.date === today) {
    setQuote(stored.quote, stored.author);
  } else {
    try {
      const res = await fetch('https://api.quotable.io/random?tags=motivational|inspirational');
      const data = await res.json();
      setQuote(data.content, data.author);
      localStorage.setItem('todayQuote', JSON.stringify({
        date: today,
        quote: data.content,
        author: data.author
      }));
    } catch {
      setQuote("You are capable of amazing things.", "");
    }
  }
}

function setQuote(q, a) {
  document.querySelector('#quote p').textContent = a ? `"${q}" — ${a}` : q;
}

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

function getWeekNumber(d) {
  const z = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = z.getUTCDay() || 7;
  z.setUTCDate(z.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(z.getUTCFullYear(),0,1));
  return Math.ceil((((z - yearStart) / 86400000) + 1)/7);
}

function saveEntry() {
  const val = document.getElementById('entryInput').value;
  if (!val) return;
  const week = 'Wk ' + getWeekNumber(new Date());
  let data = JSON.parse(localStorage.getItem('entries') || '{}');
  data[week] = val;
  localStorage.setItem('entries', JSON.stringify(data));
  document.getElementById('entryInput').value = '';
  renderEntries();
}

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

document.addEventListener('DOMContentLoaded', () => {
  loadQuote();
  loadLoveNote();
  renderEntries();
});

document.getElementById('saveEntry').addEventListener('click', saveEntry);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('SW registered'));
}
