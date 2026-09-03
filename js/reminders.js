/**
 * reminders.js
 * Feature: Watering Reminders — surfaces which plants need water soonest.
 * Owns: #reminders-list
 */

const Reminders = (() => {
  function urgency(daysLeft) {
    if (daysLeft <= 0) return { tag: "tag--urgent", label: daysLeft === 0 ? "Due today" : `${Math.abs(daysLeft)}d overdue` };
    if (daysLeft <= 2) return { tag: "tag--soon", label: `Due in ${daysLeft}d` };
    return { tag: "tag--ok", label: `Due in ${daysLeft}d` };
  }

  function render() {
    const list = document.getElementById("reminders-list");
    const plants = [...Store.getPlants()].sort(
      (a, b) => Store.daysUntilDue(a) - Store.daysUntilDue(b)
    );

    if (plants.length === 0) {
      list.innerHTML = `<p class="empty-note">Add a plant in the library to start tracking reminders.</p>`;
      return;
    }

    list.innerHTML = plants
      .map((p) => {
        const daysLeft = Store.daysUntilDue(p);
        const u = urgency(daysLeft);
        return `
        <div class="reminder-row">
          <div class="reminder-row__info">
            <span class="reminder-row__name">${p.name}</span>
            <span class="reminder-row__detail">${p.light} · every ${p.frequency} days</span>
          </div>
          <div class="reminder-row__actions">
            <span class="tag ${u.tag}">${u.label}</span>
            <button class="btn-water" data-water="${p.id}">Mark watered</button>
          </div>
        </div>`;
      })
      .join("");

    list.querySelectorAll("[data-water]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Store.markWatered(btn.dataset.water);
        App.refreshAll();
      });
    });
  }

  return { render, urgency };
})();
