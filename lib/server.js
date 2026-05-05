const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

/* -------------------------
   SAVE LOGS
--------------------------*/
app.post("/save", (req, res) => {
  const { book, chapter, verse, text } = req.body;

  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  const now = new Date();
  const stamp = now.toISOString().replace("T", " ").split(".")[0];

  const safeBook    = (book    || "UNKNOWN").toUpperCase();
  const safeChapter = Number(chapter) || 1;
  const safeVerse   = Number(verse)   || 1;

  const logLine =
    `${stamp} | IP:${ip} | BOOK:${safeBook} | VERSE:${safeChapter}:${safeVerse} | TEXT:${text}\n`;

  const logPath = path.join(__dirname, "..", "logs/edits.log");

  fs.appendFileSync(logPath, logLine);

  console.log(logLine);

  res.json({ ok: true });
});

/* -------------------------
   TRACK NAVIGATION
--------------------------*/
app.post("/track", (req, res) => {
  const {
    book, chapter,
    resolution, viewport, pixelRatio,
    language, platform, timezone,
    cores, memory, touch,
    netType, downlink,
    referrer, userAgent
  } = req.body;

  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  const now = new Date();
  const stamp = now.toISOString().replace("T", " ").split(".")[0];

  const safeBook    = (book    || "UNKNOWN").toUpperCase();
  const safeChapter = Number(chapter) || 1;

  const logLine = [
    stamp,
    `IP:${ip}`,
    `BOOK:${safeBook}`,
    `CH:${safeChapter}`,
    `RES:${resolution  || "-"}`,
    `VIEW:${viewport   || "-"}`,
    `DPR:${pixelRatio  || "-"}`,
    `LANG:${language   || "-"}`,
    `PLAT:${platform   || "-"}`,
    `TZ:${timezone     || "-"}`,
    `CORES:${cores     ?? "-"}`,
    `MEM:${memory      ?? "-"}GB`,
    `TOUCH:${touch     ?? "-"}`,
    `NET:${netType     || "-"}`,
    `DL:${downlink     || "-"}Mbps`,
    `REF:${referrer    || "-"}`,
    `UA:${userAgent    || "-"}`
  ].join(" | ") + "\n";

  const logPath = path.join(__dirname, "..", "logs/stat.log");

  fs.appendFileSync(logPath, logLine);

  res.json({ ok: true });
});

app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

/* -------------------------
   START SERVER
--------------------------*/
app.listen(8000, "0.0.0.0", () => {
  console.log("\n==============================");
  console.log("🚀 EXPRESS SERVER STARTED");
  console.log("🌐 http://IP:PORT");
  console.log("==============================\n");
});