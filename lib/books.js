import { books, state } from "./state.js";
import { loadBook, buildPageNav } from "./pages.js";

export function buildBookNav() {
  const nav = document.getElementById("bookNav");
  nav.innerHTML = "";

  books.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.display; 

    if (b.name === state.activeBook) btn.classList.add("selected"); 

    btn.onclick = () => {
      state.activeBook = b.name; 
      state.activePage = 1;

      state.maxPages = b.pages;

      loadBook(b.name);
      buildBookNav();
      buildPageNav();
    };

    nav.appendChild(btn);
  });
}