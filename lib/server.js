import express  from "express";
import fs       from "fs";
import path     from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

app.use("/logs", (req, res) => res.status(403).end());

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

  const now   = new Date();
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
    url, referrer,
    resolution, viewport, pixelRatio,
    colorDepth, orientation, hdr, darkMode, reducedMotion,
    deviceType,
    browserName, browserVersion, cookiesEnabled, doNotTrack, pdfViewer,
    osName, platform,
    language, languages, timezone,
    cores, memory, touch, gpu,
    netType, downlink, rtt, saveData,
    batteryLevel, batteryCharging,
    userAgent
  } = req.body;

  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  const now   = new Date();
  const stamp = now.toISOString().replace("T", " ").split(".")[0];

  const safeBook    = (book    || "UNKNOWN").toUpperCase();
  const safeChapter = Number(chapter) || 1;

  const logLine = [
    stamp,
    `IP:${ip}`,
    `BOOK:${safeBook}`,
    `CH:${safeChapter}`,
    `URL:${url                  || "-"}`,
    // screen
    `RES:${resolution           || "-"}`,
    `VIEW:${viewport            || "-"}`,
    `DPR:${pixelRatio           ?? "-"}`,
    `DEPTH:${colorDepth         ?? "-"}`,
    `ORI:${orientation          || "-"}`,
    `HDR:${hdr                  ?? "-"}`,
    `DARK:${darkMode            ?? "-"}`,
    `MOTION:${reducedMotion     ?? "-"}`,
    // device & browser
    `DEV:${deviceType           || "-"}`,
    `BR:${browserName           || "-"}`,
    `BRV:${browserVersion       || "-"}`,
    `COOKIES:${cookiesEnabled   ?? "-"}`,
    `DNT:${doNotTrack           ?? "-"}`,
    `PDF:${pdfViewer            ?? "-"}`,
    // OS
    `OS:${osName                || "-"}`,
    `PLAT:${platform            || "-"}`,
    // locale
    `LANG:${language            || "-"}`,
    `LANGS:${languages          || "-"}`,
    `TZ:${timezone              || "-"}`,
    // hardware
    `CORES:${cores              ?? "-"}`,
    `MEM:${memory               ?? "-"}GB`,
    `TOUCH:${touch              ?? "-"}`,
    `GPU:${gpu                  || "-"}`,
    // network
    `NET:${netType              || "-"}`,
    `DL:${downlink              || "-"}Mbps`,
    `RTT:${rtt                  ?? "-"}ms`,
    `SAVE:${saveData            ?? "-"}`,
    // battery
    `BAT:${batteryLevel         ?? "-"}%`,
    `CHARGING:${batteryCharging ?? "-"}`,
    // context
    `REF:${referrer             || "-"}`,
    `UA:${userAgent             || "-"}`
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