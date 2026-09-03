/**
 * library.js
 * Feature: Plant Library — adding plants and browsing the collection.
 * Owns: #plant-form, #library-grid
 */

const Library = (() => {
  function render() {
    const grid = document.getElementById("library-grid");
    const plants = Store.getPlants();

    if (plants.length === 0) {
      grid.innerHTML = `<p class="empty-note">No plants yet — add your first one above.</p>`;
      return;
    }

    grid.innerHTML = plants
      .map(
        (p) => `
        <article class="plant-card">
          <span class="plant-card__name">${escapeHtml(p.name)}</span>
          ${p.species ? `<span class="plant-card__species">${escapeHtml(p.species)}</span>` : ""}
          <div class="plant-card__meta">
            <span>${escapeHtml(p.light)}</span>
            <span>Water every ${p.frequency} days</span>
            <span>Last watered ${Store.daysSince(p.lastWatered)}d ago</span>
          </div>
          <button class="plant-card__remove" data-remove="${p.id}">Remove</button>
        </article>`
      )
      .join("");

    grid.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Store.removePlant(btn.dataset.remove);
        App.refreshAll();
      });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function initForm() {
    const form = document.getElementById("plant-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      Store.addPlant({
        name: data.get("name").trim(),
        species: data.get("species").trim(),
        light: data.get("light"),
        frequency: Number(data.get("frequency")),
      });
      form.reset();
      App.refreshAll();
    });
  }

  return { render, initForm };
})();
