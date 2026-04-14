let page = 1;
let maxPages = 21;

let editing = null;

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

      lines.forEach((l, index) => {
        const div = document.createElement("div");
        div.className = "line";
        div.textContent = l;

        div.dataset.index = index;

        div.addEventListener("click", () => makeEditable(div));

        container.appendChild(div);
      });
    });
}

// MAKE EDITABLE
function makeEditable(div) {
  if (editing) return;

  editing = div;

  const textarea = document.createElement("textarea");
  textarea.value = div.textContent;

  textarea.dataset.index = div.dataset.index;

  textarea.style.width = "100%";
  textarea.style.fontSize = "45px";
  textarea.style.fontFamily = "Georgia, serif";
  textarea.style.background = "#1a1a1a";
  textarea.style.color = "#eaeaea";
  textarea.style.border = "1px solid #444";
  textarea.style.padding = "12px";
  textarea.style.borderRadius = "6px";

  div.replaceWith(textarea);
  textarea.focus();

  textarea.addEventListener("blur", () => saveEdit(textarea));

  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      textarea.blur();
    }
  });
}

// SAVE EDIT
function saveEdit(textarea) {
  const index = textarea.dataset.index;
  const newText = textarea.value;

  const newDiv = document.createElement("div");
  newDiv.className = "line";
  newDiv.textContent = newText;

  newDiv.dataset.index = index;

  newDiv.addEventListener("click", () => makeEditable(newDiv));

  textarea.replaceWith(newDiv);

  fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      page: page,
      line: index,
      text: newText
    })
  });

  editing = null;
}

// PAGE CHANGE
function goPage(n) {
  page = n;
  loadPage();
}

// INIT
buildNav();
loadPage();