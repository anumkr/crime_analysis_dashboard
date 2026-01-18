const db = require("./db");

db.run("DELETE FROM crimes", [], (err) => {
  if (err) console.error("❌ Error clearing table:", err.message);
});

const sampleData = [
  ["Theft", "Downtown", "2025-07-14", "22:30", "Stolen wallet", "High", "Open"],
  ["Theft", "Downtown", "2025-07-15", "21:00", "Phone snatched", "High", "Open"],
  ["Theft", "Downtown", "2025-07-16", "20:45", "Bag stolen", "Medium", "Open"],
  ["Theft", "Downtown", "2025-07-17", "19:30", "Pickpocketing", "Medium", "Closed"],
  ["Assault", "Park", "2025-03-02", "18:15", "Fight reported", "Medium", "Closed"],
  ["Burglary", "Suburbs", "2025-12-20", "02:00", "House break-in", "High", "Open"],
  ["Theft", "Market", "2025-08-05", "14:00", "Shoplifting", "Low", "Closed"],
  ["Fraud", "Bank", "2025-06-10", "11:45", "Credit card scam", "High", "Under Investigation"],
  ["Robbery", "Downtown", "2025-09-21", "20:15", "Armed robbery", "Critical", "Open"],
  ["Theft", "Station", "2025-11-03", "07:50", "Pickpocketing", "Medium", "Open"]
];


sampleData.forEach(([crime_type, location, date, time, description, severity, status]) => {
  db.run(
    `INSERT INTO crimes (crime_type, location, date, time, description, severity, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [crime_type, location, date, time, description, severity, status],
    (err) => {
      if (err) console.error("❌ Error inserting:", err.message);
    }
  );
});

console.log("✅ Sample crime records inserted");
