import { state, books } from "./state.js";
import { makeEditable } from "./editor.js";

/* -------------------------
   LOAD BOOK
--------------------------*/
export function loadBook(bookName) {
  state.book = bookName;
  state.page = 1;
  state.activePage = 1;

  const book = books.find(b => b.name === bookName);

  // ✅ safe fallback
  state.maxPages = book?.pages ?? 1;

  buildPageNav();
  loadPage();
}

/* -------------------------
   PAGE SWITCH
--------------------------*/
export function goPage(n) {
  const pageNum = Number(n);

  if (!Number.isFinite(pageNum)) return;

  state.page = pageNum;
  state.activePage = pageNum;

  loadPage();
}

/* -------------------------
   PAGE NAV
--------------------------*/
export function buildPageNav() {
  const nav = document.getElementById("pageNav");
  nav.innerHTML = "";

  for (let i = 1; i <= state.maxPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === state.activePage) btn.classList.add("selected");

    btn.onclick = () => {
      state.activePage = i;
      goPage(i);
      buildPageNav();
    };

    nav.appendChild(btn);
  }
}

/* -------------------------
   LOAD PAGE CONTENT
--------------------------*/
export function loadPage() {
  if (!state.book) return;
  if (!Number.isFinite(state.page)) state.page = 1;

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