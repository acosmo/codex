import { state, books } from "./state.js";
import { makeEditable } from "./editor.js";

function parsePages(str) {
  const pages = new Set();

  str.split(";").forEach(part => {
    part = part.trim();

    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      for (let i = start; i <= end; i++) {
        pages.add(i);
      }
    } else {
      const n = Number(part);
      if (!Number.isNaN(n)) pages.add(n);
    }
  });

  return Array.from(pages).sort((a, b) => a - b);
}

/* -------------------------
   LOAD BOOK
--------------------------*/
export function loadBook(bookName) {
  state.book = bookName;
  state.page = 1;
  state.activePage = 1;

  const book = books.find(b => b.name === bookName);

  // ✅ build real page list
  state.pagesList = book ? parsePages(book.pages) : [];

  buildPageNav();
  loadPage();
}

/* -------------------------
   PAGE SWITCH
--------------------------*/
export function goPage(n) {
  const pageNum = Number(n);

  if (!state.pagesList.includes(pageNum)) return;

  state.page = pageNum;
  state.activePage = pageNum;

  loadPage();
  buildPageNav();
}

/* -------------------------
   PAGE NAV
--------------------------*/
export function buildPageNav() {
  const nav = document.getElementById("pageNav");
  nav.innerHTML = "";

  state.pagesList.forEach(page => {
    const btn = document.createElement("button");
    btn.textContent = page;

    if (page === state.activePage) {
      btn.classList.add("selected");
    }

    btn.onclick = () => {
      goPage(page);
    };

    nav.appendChild(btn);
  });
}

/* -------------------------
   LOAD PAGE CONTENT
--------------------------*/
export function loadPage() {
  if (!state.book) return;

  if (!state.pagesList.includes(state.page)) {
    state.page = state.pagesList[0] ?? 1;
  }

  fetch(`books/${state.book}/${state.page}.html`)
    .then(res => {
      if (!res.ok) throw new Error("Page not found");
      return res.text();
    })
    .then(text => {
      const lines = text.split("\n").filter(l => l.trim());

      const container = document.getElementById("content");
      container.innerHTML = "";

      lines.forEach((line, index) => {
        const div = document.createElement("div");
        div.className = "line";

        const match = line.match(/^(\d+)\s*(.*)/);

        if (match) {
          const [, num, text] = match;

          const numSpan = document.createElement("span");
          numSpan.className = "verse-num";
          numSpan.textContent = num;

          const textSpan = document.createElement("span");
          textSpan.className = "verse-text";
          textSpan.textContent = text;

          div.appendChild(numSpan);
          div.appendChild(textSpan);
        } else {
          div.textContent = line;
        }

        div.dataset.index = index;
        div.onclick = () => makeEditable(div);

        container.appendChild(div);
      });
    })
    .catch(() => {
      document.getElementById("content").innerHTML = "Page not found";
    });
}

