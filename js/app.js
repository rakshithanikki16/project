/**
 * app.js
 * App shell: tab navigation, dashboard summary, and startup wiring.
 * Delegates feature rendering to Library, Reminders, and Journal.
 */

const App = (() => {
  function switchView(viewName) {
    document.querySelectorAll(".nav__item").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.view === viewName);
    });
    document.querySelectorAll(".view").forEach((section) => {
      section.classList.toggle("is-active", section.id === `view-${viewName}`);
    });
  }

  function renderDashboard() {
    const plants = Store.getPlants();
    const journal = Store.getJournal();
    const dueNow = plants.filter((p) => Store.daysUntilDue(p) <= 0);

    document.getElementById("dashboard-stats").innerHTML = `
      <div class="stat">
        <span class="stat__value">${plants.length}</span>
        <span class="stat__label">plants tracked</span>
      </div>
      <div class="stat">
        <span class="stat__value">${dueNow.length}</span>
        <span class="stat__label">need water now</span>
      </div>
      <div class="stat">
        <span class="stat__value">${journal.length}</span>
        <span class="stat__label">journal entries</span>
      </div>
    `;

    const dueList = document.getElementById("dashboard-due");
    if (dueNow.length === 0) {
      dueList.innerHTML = `<li class="empty">Nothing needs water right now.</li>`;
    } else {
      dueList.innerHTML = dueNow
        .map((p) => {
          const u = Reminders.urgency(Store.daysUntilDue(p));
          return `<li>${p.name} <span class="tag ${u.tag}">${u.label}</span></li>`;
        })
        .join("");
    }

    const journalList = document.getElementById("dashboard-journal");
    const recent = journal.slice(0, 4);
    if (recent.length === 0) {
      journalList.innerHTML = `<li class="empty">No entries yet.</li>`;
    } else {
      journalList.innerHTML = recent
        .map((e) => {
          const plant = plants.find((p) => p.id === e.plantId);
          return `<li>${plant ? plant.name : "Removed plant"} <span>${e.note.slice(0, 40)}${e.note.length > 40 ? "…" : ""}</span></li>`;
        })
        .join("");
    }
  }

  function refreshAll() {
    renderDashboard();
    Library.render();
    Reminders.render();
    Journal.populatePlantSelect();
    Journal.render();
  }

  function initNav() {
    document.querySelectorAll(".nav__item").forEach((btn) => {
      btn.addEventListener("click", () => switchView(btn.dataset.view));
    });
  }

  function initTheme() {
    const themeToggle = document.getElementById("themeToggle");

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️ Light Mode";
      } else {
        themeToggle.textContent = "🌙 Dark Mode";
      }
    });
  } 









 function init() {
    Store.seedIfEmpty();
    initNav();
    Library.initForm();
    Journal.initForm();
    initTheme();
    refreshAll();
  }

  document.addEventListener("DOMContentLoaded", init);

  return { refreshAll };
})();
