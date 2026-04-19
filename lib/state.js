export let books = [
  { name: "john", display: "ИОАНН", pages: 21 },
  { name: "mark", display: "МАРК", pages: 16 },
  { name: "barnaba", display: "ВАРНАВА", pages: 21 }
];

export let state = {
  book: null,
  page: 1,
  maxPages: 1,
  activeBook: "john",
  activePage: 1,
  editing: null
};