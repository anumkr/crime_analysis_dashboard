// modal.js

document.addEventListener("DOMContentLoaded", () => {
  const addModal = document.getElementById("addRecordModal");
  const addBtn = document.getElementById("addrecordbtn");
  const closeBtn = document.getElementById("closeModalBtn"); // optional close button

  // Open Add Record modal
  addBtn.addEventListener("click", () => {
    addModal.style.display = "flex";
  });

  // Close Add Record modal when close button is clicked
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeAddModal();
    });
  }

  // Close Add Record modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === addModal) {
      closeAddModal();
    }
  });
});

// -------------------- Add Record --------------------
function closeAddModal() {
  const modal = document.getElementById("addRecordModal");
  modal.style.display = "none";
}

document.getElementById("crimeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const crime = {
    crime_type: document.getElementById("crime_type").value,
    location: document.getElementById("location").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    description: document.getElementById("description").value,
    severity: document.getElementById("severity").value,
    status: document.getElementById("status").value
  };

  try {
    const response = await fetch("http://localhost:3000/crimes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(crime)
    });

    if (!response.ok) throw new Error("Failed to submit record");

    alert("Crime record submitted successfully!");
    closeAddModal();
    document.getElementById("crimeForm").reset();

    if (typeof loadCrimeTable === "function") {
      loadCrimeTable();
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong. Please try again.");
  }
});

// -------------------- Delete Record --------------------
async function deleteCrime(id) {
  if (!confirm("Are you sure you want to delete this record?")) return;

  try {
    const response = await fetch(`http://localhost:3000/crimes/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("Failed to delete record");

    alert("Record deleted successfully!");
    loadCrimeTable();
  } catch (err) {
    console.error("Error deleting record:", err);
    alert("Something went wrong while deleting.");
  }
}

// -------------------- Edit Record --------------------
function openEditModal(crime) {
  document.getElementById("editRecordModal").style.display = "flex";

  document.getElementById("edit_crime_id").value = crime.crime_id;
  document.getElementById("edit_crime_type").value = crime.crime_type;
  document.getElementById("edit_location").value = crime.location;
  document.getElementById("edit_date").value = crime.date;
  document.getElementById("edit_time").value = crime.time;
  document.getElementById("edit_severity").value = crime.severity;
  document.getElementById("edit_status").value = crime.status;
  document.getElementById("edit_description").value = crime.description || "";
}

function closeEditModal() {
  document.getElementById("editRecordModal").style.display = "none";
}

document.getElementById("editCrimeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("edit_crime_id").value;
  const updatedCrime = {
    crime_type: document.getElementById("edit_crime_type").value,
    location: document.getElementById("edit_location").value,
    date: document.getElementById("edit_date").value,
    time: document.getElementById("edit_time").value,
    description: document.getElementById("edit_description").value,
    severity: document.getElementById("edit_severity").value,
    status: document.getElementById("edit_status").value
  };

  try {
    const response = await fetch(`http://localhost:3000/crimes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCrime)
    });

    if (!response.ok) throw new Error("Failed to update record");

    alert("Record updated successfully!");
    closeEditModal();
    loadCrimeTable();
  } catch (err) {
    console.error("Error updating record:", err);
    alert("Something went wrong while updating.");
  }
});

// -------------------- Search --------------------
document.getElementById("searchbar").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const rows = document.querySelectorAll("#crimeTableBody tr");

  rows.forEach(row => {
    const type = row.children[1].textContent.toLowerCase();
    const location = row.children[2].textContent.toLowerCase();

    if (type.includes(query) || location.includes(query)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});

