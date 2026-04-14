const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

// 🌍 Request logger (runs for every request)
app.use((req, res, next) => {
  const time = new Date().toISOString();
  console.log(`\n[REQUEST] ${time}`);
  console.log(`➡️ Method: ${req.method}`);
  console.log(`➡️ URL: ${req.url}`);
  console.log(`➡️ IP: ${req.headers["x-forwarded-for"] || req.socket.remoteAddress}`);
  next();
});


app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use(express.static(path.join(__dirname, "..")));

// 📩 SAVE ROUTE
app.post("/save", (req, res) => {
  console.log("\n[POST /save] received");

  const text = req.body.text || "";
  console.log("📝 Text:", text);

  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  const now = new Date();
  const stamp = now.toISOString().replace("T", " ").split(".")[0];

  const line = `${stamp} | ${ip} | ${text}\n`;

  console.log("💾 Writing to file:", line.trim());

  try {
    fs.appendFileSync(
      path.join(__dirname, "..", "logs/edits.log"),
      line
    );

    console.log("✅ Saved successfully");

    res.json({ ok: true });
  } catch (err) {
    console.error("❌ File write error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 🚀 SERVER START
app.listen(8000, "0.0.0.0", () => {
  console.log("\n==============================");
  console.log("🚀 EXPRESS SERVER STARTED");
  console.log("🌐 http://localhost:8000");
  console.log("==============================\n");
});