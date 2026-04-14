let page = 1;
let maxPages = 21;

let selectedLine = null;

// NAV
function buildNav() {
  const top = document.getElementById("topNav");
  const bottom = document.getElementById("bottomNav");

  let html = "";
  for (let i = 1; i <= maxPages; i++) {
    html += `<button onclick="goPage(${i})">${i}</button>`;
  }

  top.innerHTML = html;
  bottom.innerHTML = html;
}

// LOAD PAGE
function loadPage() {
  fetch(page + ".html")
    .then(res => res.text())
    .then(text => {
      const lines = text.split("\n").filter(l => l.trim());

      const container = document.getElementById("content");
      container.innerHTML = "";

      lines.forEach(l => {
        const div = document.createElement("div");
        div.className = "line";
        div.textContent = l;

        div.addEventListener("click", () => openModal(div));

        container.appendChild(div);
      });
    });
    console.log("SCRIPT LOADED");
}

// PAGE CHANGE
function goPage(n) {
  page = n;
  loadPage();
}

// MODAL OPEN
function openModal(el) {
  console.log("CLICK WORKS → openModal triggered");

  selectedLine = el;
  document.getElementById("editText").value = el.innerText;
  document.getElementById("modal").style.display = "flex";
}

// CLOSE MODAL
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// SAVE TO SERVER
function saveEdit() {
  const text = document.getElementById("editText").value;

  selectedLine.innerText = text;

  fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  closeModal();
}

buildNav();
loadPage();