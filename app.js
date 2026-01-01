const API_URL = "https://script.google.com/macros/s/AKfycbx-S8XjQcfB_V1Wob28PFJsXzlr16xngrl_P3hlIhj_GJ81jysvdkgCC5VJ5Dr32sHqlA/exec";

let currentDate = new Date();

/* ======================
   INIT
====================== */
document.addEventListener("DOMContentLoaded", () => {
  loadMonth();
});

/* ======================
   LOAD DATA
====================== */
function loadMonth() {
  const y = currentDate.getFullYear();
  const m = currentDate.getMonth() + 1;

  document.getElementById("currentMonth").innerText =
    `${m}/${y}`;

  fetch(`${API_URL}?action=getMonth&year=${y}&month=${m}`)
    .then(r => r.json())
    .then(renderTable);
}

function renderTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.ID}</td>
      <td>${formatDate(r.DATE)}</td>
      <td>${r.DETAIL}</td>
      <td>${r.PAY}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ======================
   NAVIGATION
====================== */
function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  loadMonth();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  loadMonth();
}

/* ======================
   MODAL
====================== */
function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

/* ======================
   SAVE
====================== */
function saveData() {
  const detail = document.getElementById("detail").value;
  const pay = document.getElementById("pay").value;

  const today = new Date();
  const id = today.getFullYear().toString() +
             (today.getMonth()+1).toString().padStart(2,'0') +
             today.getDate().toString().padStart(2,'0');

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "post",
      ID: Number(id),
      DATE: today.toISOString().slice(0,10),
      DETAIL: detail,
      PAY: Number(pay)
    })
  }).then(() => {
    closeModal();
    loadMonth();
  });
}

/* ======================
   UTIL
====================== */
function formatDate(d) {
  return new Date(d).toLocaleDateString("vi-VN");
}
