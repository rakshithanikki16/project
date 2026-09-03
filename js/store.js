/**
 * store.js
 * Small localStorage-backed store shared by every feature module.
 * Nothing here renders anything — it only owns the data.
 */

const Store = (() => {
  const PLANTS_KEY = "greenhouse-log:plants";
  const JOURNAL_KEY = "greenhouse-log:journal";

  function isoDaysAgo(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
  }

  function seedIfEmpty() {
    if (localStorage.getItem(PLANTS_KEY) === null) {
      const plants = SEED_PLANTS.map((p, i) => ({
        id: "p" + (i + 1),
        name: p.name,
        species: p.species,
        light: p.light,
        frequency: p.frequency,
        lastWatered: isoDaysAgo(p.daysAgoWatered),
      }));
      localStorage.setItem(PLANTS_KEY, JSON.stringify(plants));

      const journal = SEED_JOURNAL.map((j, i) => ({
        id: "j" + (i + 1),
        plantId: "p" + (j.plantIndex + 1),
        note: j.note,
        date: isoDaysAgo(j.daysAgo),
      }));
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
    }
  }

  function getPlants() {
    return JSON.parse(localStorage.getItem(PLANTS_KEY) || "[]");
  }

  function savePlants(plants) {
    localStorage.setItem(PLANTS_KEY, JSON.stringify(plants));
  }

  function addPlant(plant) {
    const plants = getPlants();
    plants.push({
      id: "p" + Date.now(),
      lastWatered: new Date().toISOString(),
      ...plant,
    });
    savePlants(plants);
  }

  function removePlant(id) {
    savePlants(getPlants().filter((p) => p.id !== id));
    // Keep journal entries but they'll simply show "removed plant" —
    // simplest correct behaviour for a small local app.
  }

  function markWatered(id) {
    const plants = getPlants().map((p) =>
      p.id === id ? { ...p, lastWatered: new Date().toISOString() } : p
    );
    savePlants(plants);
  }

  function getJournal() {
    return JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]");
  }

  function addJournalEntry(entry) {
    const journal = getJournal();
    journal.unshift({
      id: "j" + Date.now(),
      date: new Date().toISOString(),
      ...entry,
    });
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
  }

  function daysSince(isoDate) {
    const ms = Date.now() - new Date(isoDate).getTime();
    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }

  function daysUntilDue(plant) {
    return plant.frequency - daysSince(plant.lastWatered);
  }

  return {
    seedIfEmpty,
    getPlants,
    addPlant,
    removePlant,
    markWatered,
    getJournal,
    addJournalEntry,
    daysSince,
    daysUntilDue,
  };
})();
