async function loadCrimeTable() {
  try {
    const response = await fetch("http://localhost:3000/crimes");
    const crimes = await response.json();

    const tbody = document.getElementById("crimeTableBody");
    tbody.innerHTML = ""; 

    crimes.forEach(crime => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${crime.crime_id}</td>
        <td>${crime.crime_type}</td>
        <td>${crime.location}</td>
        <td>${crime.date}</td>
        <td class="severity-${crime.severity.toLowerCase()}">${crime.severity}</td>
        <td>${crime.status}</td>
        <td class="actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;
      tbody.appendChild(row);

      
      const editBtn = row.querySelector(".edit-btn");
      editBtn.addEventListener("click", () => openEditModal(crime));

      const deleteBtn = row.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => deleteCrime(crime.crime_id));
    });
  } catch (err) {
    console.error("Failed to load crime records:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadCrimeTable);

