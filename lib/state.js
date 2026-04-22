export let books = [
  { name: "john",    display: "ИОАНН",   pages: "1-21" },
  { name: "mark",    display: "МАРК",    pages: "1-16" },
  { name: "barnaba", display: "ВАРНАВА", pages: "1-21" },
  { name: "hermas",  display: "ГЕРМА",   pages: "1-31;66-68;91-95" }
];

export let state = {
  book: null,
  page: 1,
  activeBook: "john",
  activePage: 1,
  editing: null,

  // resolved pages list for current book
  pagesList: []
};