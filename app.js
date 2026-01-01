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

  document.getElementById("currentMonth").innerText = `${m}/${y}`;

  fetch(`${API_URL}?action=getMonth&year=${y}&month=${m}`)
    .then(r => r.json())
    .then(renderTable);
}

function renderTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  if (!data || data.length === 0) return;

  const weeks = groupByWeek(data);

  weeks.forEach(week => {
    const weekRowSpan = week.days.reduce(
      (s, d) => s + d.items.length, 0
    );

    let firstWeekRow = true;

    week.days.forEach(day => {
      const dayTotal = day.items.reduce(
        (s, i) => s + Number(i.PAY), 0
      );

      day.items.forEach((item, idx) => {
        const tr = document.createElement("tr");

        // WEEK
        if (firstWeekRow) {
          tr.innerHTML += `
            <td rowspan="${weekRowSpan}"
                class="fw-bold bg-light text-center align-middle">
              W${week.week}
            </td>`;
          firstWeekRow = false;
        }

        // DAY + DATE
        if (idx === 0) {
          tr.innerHTML += `
            <td rowspan="${day.items.length}" class="align-middle">
              ${day.weekday}
            </td>
            <td rowspan="${day.items.length}" class="align-middle">
              ${day.date}
            </td>
          `;
        }

        // DETAIL + PAY INLINE
        tr.innerHTML += `
          <td>
            <div class="d-flex justify-content-between">
              <span>${item.DETAIL}</span>
              <span class="text-muted">
                ${Number(item.PAY).toLocaleString()}
              </span>
            </div>
          </td>
        `;

        // TOTAL / DAY
        if (idx === 0) {
          tr.innerHTML += `
            <td rowspan="${day.items.length}"
                class="text-end fw-bold align-middle">
              ${dayTotal.toLocaleString()}
            </td>
          `;
        }

        tbody.appendChild(tr);
      });
    });
  });
}

/* ======================
   NAV
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
  const id =
    today.getFullYear().toString() +
    (today.getMonth() + 1).toString().padStart(2, "0") +
    today.getDate().toString().padStart(2, "0");

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "post",
      ID: Number(id),
      DATE: today.toISOString().slice(0, 10),
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
function groupByWeek(data) {
  const map = {};

  data.forEach(r => {
    const d = new Date(r.DATE);
    const week = getWeekOfMonth(d);
    const dayKey = d.toISOString().slice(0, 10);

    if (!map[week]) map[week] = {};
    if (!map[week][dayKey]) {
      map[week][dayKey] = {
        weekday: getWeekdayEN(d),
        date: formatDDMM(d),
        items: []
      };
    }

    map[week][dayKey].items.push(r);
  });

  return Object.keys(map).map(w => ({
    week: w,
    days: Object.values(map[w])
  }));
}

function getWeekOfMonth(date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  let firstWeekday = firstDay.getDay();
  if (firstWeekday === 0) firstWeekday = 7;
  return Math.ceil((date.getDate() + firstWeekday - 1) / 7);
}

function getWeekdayEN(date) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
}

function formatDDMM(date) {
  return (
    date.getDate().toString().padStart(2, "0") +
    "/" +
    (date.getMonth() + 1).toString().padStart(2, "0")
  );
}
