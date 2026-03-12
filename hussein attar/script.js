const counterEl = document.getElementById("counter");
const loveBtn = document.getElementById("loveBtn");
const statusEl = document.getElementById("status");
const hearts = Array.from(document.querySelectorAll(".heart"));

const palette = ["#ff4d6d", "#ff9f1c", "#2ec4b6", "#3a86ff", "#9b5de5", "#06d6a0"];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function animateHearts() {
  const order = shuffle([0, 1, 2, 3, 4, 5]);
  hearts.forEach((heart, idx) => {
    heart.style.order = order[idx];
    heart.style.color = palette[Math.floor(Math.random() * palette.length)];
    const x = Math.floor(Math.random() * 16) - 8;
    const y = Math.floor(Math.random() * 12) - 6;
    const scale = 0.9 + Math.random() * 0.45;
    heart.style.transform = `translate(${x}px, ${y}px) scale(${scale.toFixed(2)}) rotate(${x}deg)`;
  });
}

async function loadCount() {
  statusEl.textContent = "";
  try {
    const response = await fetch("/api/count");
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const data = await response.json();
    counterEl.textContent = data.count;
  } catch {
    statusEl.textContent = "تعذر تحميل العداد. جرّب تحديث الصفحة.";
  }
}

async function incrementCount() {
  loveBtn.disabled = true;
  statusEl.textContent = "جارٍ إضافة حب جديد...";

  try {
    const response = await fetch("/api/count/increment", { method: "POST" });
    if (!response.ok) {
      throw new Error("Request failed");
    }
    const data = await response.json();
    counterEl.textContent = data.count;
    statusEl.textContent = "تمت الإضافة بنجاح!";
  } catch {
    statusEl.textContent = "حدث خطأ أثناء الإضافة. حاول مرة ثانية.";
  } finally {
    loveBtn.disabled = false;
  }
}

loveBtn.addEventListener("click", incrementCount);

loadCount();
animateHearts();
setInterval(animateHearts, 150);