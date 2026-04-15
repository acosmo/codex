import { state } from "./state.js";

/* -------------------------
   EDIT START
--------------------------*/
export function makeEditable(div) {
  if (state.editing) return;

  state.editing = div;

  const textarea = document.createElement("textarea");
  textarea.value = div.textContent;

  // must be string but safe
  textarea.dataset.index = String(div.dataset.index);

  textarea.dataset.original = div.textContent;

  textarea.classList.add("editing");

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

/* -------------------------
   SAVE EDIT
--------------------------*/
export function saveEdit(textarea) {
  const index = Number(textarea.dataset.index); // ✅ FORCE NUMBER
  const newText = textarea.value;
  const oldText = textarea.dataset.original;

  const div = document.createElement("div");
  div.className = "line";
  div.textContent = newText;
  div.dataset.index = String(index);

  div.onclick = () => makeEditable(div);

  textarea.replaceWith(div);

  // ❌ SAFETY CHECK (THIS FIXES YOUR BUG)
  if (!state.book) {
    console.error("BOOK IS UNDEFINED → state.book not set");
    state.editing = null;
    return;
  }

  if (Number.isNaN(index)) {
    console.error("INDEX IS NaN → dataset broken");
    state.editing = null;
    return;
  }

  // ✅ ONLY SEND IF CHANGED
  if (newText !== oldText) {
    fetch("/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book: state.book,
        chapter: state.page,
        verse: index + 1,
        ref: `${state.book.toUpperCase()} ${state.page}:${index + 1}`,
        text: newText
      })
    });
  }

  state.editing = null;
}