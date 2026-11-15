// ===== Mobile menu =====
const menuBtn = document.getElementById("menu-btn");
const navList = document.getElementById("nav-list");
menuBtn.addEventListener("click", function () {
  const open = navList.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

// ===== Academic Planner =====
const taskList = document.getElementById("task-list");
if (taskList) {
  const input = document.getElementById("task-input");
  const errorEl = document.getElementById("task-error");
  const countEl = document.getElementById("task-count");
  let tasks = [];
  try { tasks = JSON.parse(localStorage.getItem("tasks")) || []; } catch (e) { tasks = []; }

  function save() { try { localStorage.setItem("tasks", JSON.stringify(tasks)); } catch (e) {} }

  function render() {
    taskList.innerHTML = "";
    tasks.forEach(function (task, index) {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = task.done;
      cb.addEventListener("change", function () { toggleTask(index); });
      const span = document.createElement("span");
      span.textContent = task.text;
      const del = document.createElement("button");
      del.textContent = "Delete";
      del.addEventListener("click", function () { deleteTask(index); });
      li.append(cb, span, del);
      taskList.appendChild(li);
    });
    const left = tasks.filter(function (t) { return !t.done; }).length;
    countEl.textContent = tasks.length ? left + " of " + tasks.length + " tasks remaining" : "No tasks yet. Add one above!";
  }

  function addTask() {
    const text = input.value.trim();
    if (text === "") { errorEl.textContent = "Please enter a task."; return; }
    errorEl.textContent = "";
    tasks.push({ text: text, done: false });
    input.value = "";
    save(); render();
  }
  function toggleTask(i) { tasks[i].done = !tasks[i].done; save(); render(); }
  function deleteTask(i) { tasks.splice(i, 1); save(); render(); }

  document.getElementById("add-btn").addEventListener("click", addTask);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") addTask(); });
  render();
}

// ===== Contact form validation =====
const form = document.getElementById("contact-form");
if (form) {
  function setError(id, msg) { document.getElementById(id + "-err").textContent = msg; }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]+$/;
    let valid = true;
    ["name", "email", "phone", "message"].forEach(function (f) { setError(f, ""); });
    document.getElementById("form-success").textContent = "";

    if (name === "") { setError("name", "Name is required."); valid = false; }
    if (email === "") { setError("email", "Email is required."); valid = false; }
    else if (!emailPattern.test(email)) { setError("email", "Enter a valid email address."); valid = false; }
    if (phone === "") { setError("phone", "Phone number is required."); valid = false; }
    else if (!phonePattern.test(phone)) { setError("phone", "Phone number must contain digits only."); valid = false; }
    if (message === "") { setError("message", "Message is required."); valid = false; }

    if (valid) {
      document.getElementById("form-success").textContent = "Thank you, " + name + "! Your message has been sent.";
      form.reset();
    }
  });
}

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll(".reveal");
const revealObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("show"); revealObs.unobserve(en.target); } });
}, { threshold: 0.12 });
revealEls.forEach(function (el) { revealObs.observe(el); });

// ===== Animated counters =====
function runCounter(el) {
  const target = Number(el.dataset.target);
  const suffix = el.dataset.suffix || "";
  const steps = 60;
  let step = 0;
  const timer = setInterval(function () {
    step++;
    el.textContent = Math.round(target * step / steps).toLocaleString() + suffix;
    if (step >= steps) clearInterval(timer);
  }, 25);
}
const counterObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); counterObs.unobserve(en.target); } });
}, { threshold: 0.5 });
document.querySelectorAll(".counter").forEach(function (c) { counterObs.observe(c); });

// ===== Farm4us gallery + lightbox =====
// Add your photos to images/farm4us/ and list the file names here.
const galleryPhotos = [
  { file: "farm1.jpg", alt: "Farm4us farmland" },
  { file: "farm2.jpg", alt: "Farmers at work with Farm4us" },
  { file: "farm3.jpg", alt: "Farm4us demonstration farm" },
  { file: "farm4.jpg", alt: "Farm4us team in the field" },
  { file: "farm5.jpg", alt: "Harvest on a Farm4us farm" },
  { file: "farm6.jpg", alt: "Valentine with farmers" }
];
const galleryEl = document.getElementById("gallery");
if (galleryEl) {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  let loaded = 0, failed = 0;
  galleryPhotos.forEach(function (p) {
    const img = document.createElement("img");
    img.src = "images/farm4us/" + p.file;
    img.alt = p.alt;
    img.loading = "lazy";
    img.addEventListener("load", function () { loaded++; });
    img.addEventListener("error", function () {
      img.remove(); failed++;
      if (failed === galleryPhotos.length) document.getElementById("gallery-empty").hidden = false;
    });
    img.addEventListener("click", function () { lbImg.src = img.src; lbImg.alt = img.alt; lb.hidden = false; });
    galleryEl.appendChild(img);
  });
  function closeLb() { lb.hidden = true; }
  document.getElementById("lb-close").addEventListener("click", closeLb);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLb(); });
}
