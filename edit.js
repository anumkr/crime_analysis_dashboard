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

