const express = require("express");
const cors = require("cors");
const db = require("./db"); 

const app = express();
app.use(cors());
app.use(express.static("frontend"));
app.use(express.json());

db.run(`CREATE TABLE IF NOT EXISTS crimes (
  crime_id INTEGER PRIMARY KEY AUTOINCREMENT,
  crime_type TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  description TEXT,
  severity TEXT,
  status TEXT
)`);

app.post("/crimes", (req, res) => {
  const { crime_type, location, date, time, description, severity, status } = req.body;
  const sql = `INSERT INTO crimes (crime_type, location, date, time, description, severity, status)
 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [crime_type, location, date, time, description, severity, status], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ crime_id: this.lastID });
  });
});

app.get("/crimes", (req, res) => {
  db.all("SELECT * FROM crimes", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.put("/crimes/:id", (req, res) => {
  const { crime_type, location, date, time, description, severity, status } = req.body;
  const sql = `UPDATE crimes SET crime_type=?, location=?, date=?, time=?, description=?, severity=?, status=? WHERE crime_id=?`;
  db.run(sql, [crime_type, location, date, time, description, severity, status, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});


app.delete("/crimes/:id", (req, res) => {
  db.run("DELETE FROM crimes WHERE crime_id=?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
