const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

// SAVE LOGS
app.post("/save", (req, res) => {
  const { page, line, text } = req.body;

  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  const now = new Date();
  const stamp = now.toISOString().replace("T", " ").split(".")[0];

  const logLine =
    `${stamp} | IP:${ip} | FILE:${page}.html | VERSE:${Number(line) + 1} | TEXT:${text}\n`;

  fs.appendFileSync(
    path.join(__dirname, "..", "logs/edits.log"),
    logLine
  );

  console.log(logLine);

  res.json({ ok: true });
});

// START SERVER
app.listen(8000, "0.0.0.0", () => {
  console.log("\n==============================");
  console.log("🚀 EXPRESS SERVER STARTED");
  console.log("🌐 http://localhost:8000");
  console.log("==============================\n");
});