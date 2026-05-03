import { buildBookNav } from "./books.js";
import { loadBook } from "./pages.js";
import { state } from "./state.js";

const parts = window.location.pathname.split("/").filter(Boolean);
const book = parts[0] ?? "john";
const chapter = Number(parts[1]) || null;
const verse = Number(parts[2]) || null;

state.activeBook = book;
state.activeVerse = verse;

buildBookNav();
loadBook(book, chapter);