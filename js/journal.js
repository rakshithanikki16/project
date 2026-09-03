/**
 * journal.js
 * Feature: Care Journal — free-text notes tied to a plant.
 * Owns: #journal-form, #journal-list
 */

const Journal = (() => {
  function populatePlantSelect() {
    const select = document.getElementById("journal-plant-select");
    const plants = Store.getPlants();
    select.innerHTML = plants
      .map((p) => `<option value="${p.id}">${p.name}</option>`)
      .join("");
  }

  function plantName(id) {
    const plant = Store.getPlants().find((p) => p.id === id);
    return plant ? plant.name : "Removed plant";
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  function render() {
    const list = document.getElementById("journal-list");
    const entries = Store.getJournal();

    if (entries.length === 0) {
      list.innerHTML = `<li class="empty-note">No journal entries yet.</li>`;
      return;
    }

    list.innerHTML = entries
      .map(
        (e) => `
        <li class="journal-entry">
          <div class="journal-entry__head">
            <span class="journal-entry__plant">${plantName(e.plantId)}</span>
            <span>${formatDate(e.date)}</span>
          </div>
          <p class="journal-entry__note">${e.note}</p>
        </li>`
      )
      .join("");
  }

  function initForm() {
    const form = document.getElementById("journal-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const plantId = data.get("plantId");
      const note = data.get("note").trim();
      if (!plantId || !note) return;

      Store.addJournalEntry({ plantId, note });
      form.reset();
      App.refreshAll();
    });
  }

  return { render, populatePlantSelect, initForm };
})();
