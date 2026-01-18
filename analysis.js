const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const seasonMap = {
  0:"Winter",1:"Winter",2:"Winter",
  3:"Spring",4:"Spring",5:"Spring",
  6:"Summer",7:"Summer",8:"Summer",
  9:"Fall",10:"Fall",11:"Fall"
};

async function loadInsights() {
  try {
    const response = await fetch("http://localhost:3000/crimes");
    const crimes = await response.json();

    if (!crimes || crimes.length === 0) {
      setText("seasonheading","No data");
      setText("hotspot","No data");
      setText("prevyear","No data");
      setText("peaktime","No data");
      setText("msg1","No data");
      setText("msg2","No data");
      setText("msg3","No data");
      document.querySelector(".detail1").textContent = "No active recommendations.";
      return;
    }

    const monthCounts = Array(12).fill(0);
    crimes.forEach(c => {
      const m = new Date(c.date).getMonth();
      if (!isNaN(m)) monthCounts[m]++;
    });
    const peakMonthIndex = monthCounts.indexOf(Math.max(...monthCounts));
    setText("msg1", `${monthNames[peakMonthIndex]} (${monthCounts[peakMonthIndex]} crimes)`);

    const locCounts = {};
    crimes.forEach(c => locCounts[c.location] = (locCounts[c.location]||0)+1);
    const lowLoc = Object.entries(locCounts).sort((a,b)=>a[1]-b[1])[0];
    setText("msg2", `${lowLoc[0]} (${lowLoc[1]} crimes)`);

    const typeCounts = {};
    crimes.forEach(c => typeCounts[c.crime_type] = (typeCounts[c.crime_type]||0)+1);
    const commonCrime = Object.entries(typeCounts).sort((a,b)=>b[1]-a[1])[0];
    setText("msg3", `${commonCrime[0]} (${commonCrime[1]} cases)`);

    const hotspot = Object.entries(locCounts).sort((a,b)=>b[1]-a[1])[0];
    setText("hotspot", `${hotspot[0]} (${hotspot[1]} crimes)`);

    const seasonCounts = {};
    crimes.forEach(c => {
      const m = new Date(c.date).getMonth();
      if (!isNaN(m)) {
        const season = seasonMap[m];
        seasonCounts[season] = (seasonCounts[season]||0)+1;
      }
    });
    const topSeason = Object.entries(seasonCounts).sort((a,b)=>b[1]-a[1])[0];
    setText("seasonheading", `${topSeason[0]} (${topSeason[1]} crimes)`);

    const yearCounts = {};
    crimes.forEach(c => {
      const y = new Date(c.date).getFullYear();
      if (!isNaN(y)) yearCounts[y] = (yearCounts[y]||0)+1;
    });
    const years = Object.entries(yearCounts).sort((a,b)=>b[0]-a[0]);
    if (years.length >= 2) {
      const [latest, previous] = years;
      const change = latest[1]-previous[1];
      const percent = ((change/previous[1])*100).toFixed(1);
      setText("prevyear", `${latest[0]} vs ${previous[0]}: ${change>=0?"+":""}${percent}% change`);
    } else {
      setText("prevyear","Not enough data");
    }

    const timeBlocks = {"Late Night":0,"Morning":0,"Afternoon":0,"Evening":0};
    crimes.forEach(c => {
      if (c.time && c.time.includes(":")) {
        const h = parseInt(c.time.split(":")[0],10);
        if (h>=0 && h<=5) timeBlocks["Late Night"]++;
        else if (h>=6 && h<=11) timeBlocks["Morning"]++;
        else if (h>=12 && h<=17) timeBlocks["Afternoon"]++;
        else if (h>=18 && h<=23) timeBlocks["Evening"]++;
      }
    });
    const peakTime = Object.entries(timeBlocks).sort((a,b)=>b[1]-a[1])[0];
    setText("peaktime", `${peakTime[0]} (${peakTime[1]} crimes)`);

    const actions = [];
    if (hotspot[1] / crimes.length > 0.25) {
      actions.push(`Increase patrols in ${hotspot[0]} between 8 PM and 2 AM.`);
    }
    const avgMonth = crimes.length / 12;
    if (monthCounts[peakMonthIndex] > avgMonth * 1.2) {
      actions.push(`Launch awareness campaigns during ${monthNames[peakMonthIndex]} month.`);
    }
    const unresolvedThefts = crimes.filter(c => c.crime_type === "Theft" && c.status == "Open").length;
    if (unresolvedThefts > 2) {
      actions.push("Focus resolution efforts on unresolved theft cases.");
    }

    const container = document.querySelector("#detail1");
    container.innerHTML = "";
    if (actions.length === 0) {
      container.textContent = "No active recommendations.";
    } else {
      actions.forEach(action => {
        const div = document.createElement("div");
        div.textContent = "• " + action;
        div.style.marginBottom = "8px";
        container.appendChild(div);
      });
    }

  } catch (err) {
    console.error("Error loading insights:", err);
    document.querySelector(".detail1").textContent = "Error loading recommendations.";
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

document.addEventListener("DOMContentLoaded", loadInsights);


