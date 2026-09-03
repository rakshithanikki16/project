/**
 * data.js
 * Seed data used the very first time the app runs (empty localStorage).
 * Dates are expressed as "days ago" at load time so the demo always
 * looks current, then converted to ISO strings by store.js.
 */

const SEED_PLANTS = [
  { name: "Marble Queen Pothos", species: "Epipremnum aureum", light: "Indirect light", frequency: 7, daysAgoWatered: 2 },
  { name: "Fiddle Leaf Fig", species: "Ficus lyrata", light: "Bright light", frequency: 10, daysAgoWatered: 9 },
  { name: "Snake Plant", species: "Dracaena trifasciata", light: "Low light", frequency: 14, daysAgoWatered: 4 },
];

const SEED_JOURNAL = [
  { plantIndex: 0, note: "New leaf unfurling near the top — keeping it out of direct sun.", daysAgo: 3 },
  { plantIndex: 1, note: "A couple of lower leaves dropped. Checking for a draft near the window.", daysAgo: 6 },
];
