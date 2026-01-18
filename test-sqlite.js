const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./crime_records.db");
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)");

    db.run("INSERT INTO test (name) VALUES (?)", ["A"], function (err) {
    if (err) return console.error(err.message);
    console.log("✅ Inserted row with ID:", this.lastID);
});

    db.all("SELECT * FROM test", [], (err, rows) => {
        if (err) return console.error(err.message);
        console.log("✅ Rows:", rows);
    });
});
