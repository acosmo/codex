import { state, books } from "./state.js";
import { makeEditable } from "./editor.js";
import { track }        from "./track.js";

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
   AUDIO BAR
--------------------------*/
let _audio = null;

export function buildAudioBar() {
  const bar   = document.getElementById("audioBar");
  const btn   = document.getElementById("audioPlayBtn");
  const label = document.getElementById("audioLabel");
  const time  = document.getElementById("audioTime");
  const fill  = document.getElementById("audioFill");
  const thumb = document.getElementById("audioThumb");
  const track = document.getElementById("audioTrack");

  if (!bar) return;

  // Stop & destroy previous audio
  if (_audio) {
    _audio.pause();
    _audio.src = "";
    _audio = null;
  }

  const src = `/books/${state.book}/audio/${state.page}.mp3`;

  const audio = new Audio();
  _audio = audio;

  // Always show the bar; dim it until audio is ready
  bar.style.display = "flex";
  bar.style.opacity = "0.4";
  btn.disabled = true;

  audio.addEventListener("canplay", () => {
    bar.style.opacity = "1";
    btn.disabled = false;
  }, { once: true });

  audio.addEventListener("error", () => {
    bar.style.opacity = "0.35";
    btn.disabled = true;
    time.textContent = "нет аудио";
  });

  audio.src = src;
  audio.preload = "metadata";

  // Label
  const bookObj = books.find(b => b.name === state.book);
  label.textContent = `${bookObj ? bookObj.display : state.book} ${state.page}`;

  const fmt = s => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const updateProgress = () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    fill.style.width  = pct + "%";
    thumb.style.left  = pct + "%";
    time.textContent  = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
  };

  audio.addEventListener("timeupdate",  updateProgress);
  audio.addEventListener("loadedmetadata", updateProgress);

  audio.addEventListener("ended", () => {
    btn.innerHTML = "&#9654;";
    fill.style.width = "0%";
    thumb.style.left = "0%";
  });

  // Play / Pause
  btn.onclick = () => {
    if (audio.paused) {
      audio.play();
      btn.innerHTML = "&#10074;&#10074;";
    } else {
      audio.pause();
      btn.innerHTML = "&#9654;";
    }
  };

  // Seek
  track.onclick = (e) => {
    if (!audio.duration) return;
    const rect = track.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
  };

  // Reset button icon
  btn.innerHTML = "&#9654;";
}

/* -------------------------
   LOAD BOOK
--------------------------*/
export function loadBook(bookName, startPage = null) {
  state.book = bookName;
  state.page = 1;
  state.activePage = 1;

  const book = books.find(b => b.name === bookName);
  state.pagesList = book ? parsePages(book.pages) : [];

  if (startPage && state.pagesList.includes(startPage)) {
    state.page = startPage;
    state.activePage = startPage;
  }

  buildPageNav();
  buildAudioBar();
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
  state.activeVerse = null;

  loadPage();
  buildPageNav();
  buildAudioBar();
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
      track(state.book, page);
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

  fetch(`/books/${state.book}/${state.page}.html`)
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
        div.onclick = () => {
          track(state.book, state.page);
          makeEditable(div);
        };

        if (state.activeVerse && index === state.activeVerse - 1) {
          div.classList.add("active-verse");
          setTimeout(() => div.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
        }

        container.appendChild(div);
      });
    })
    .catch(() => {
      document.getElementById("content").innerHTML = "Page not found";
    });
}