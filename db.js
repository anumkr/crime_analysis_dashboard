const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./crime_records.db", (err) => {
  if (err) {
    console.error("❌ Could not connect to SQLite:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

module.exports = db;

