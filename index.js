
document.getElementById("studentForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const student = {
        name: formData.get("name"),
        id: formData.get("id"),
        email: formData.get("email"),
        number: formData.get("number"),
    };

    // Validation for all fields
    if (!student.name || !student.id || !student.email || !student.number) {
        alert("Please fill in all fields.");
        return;
    }
    // Validate number field (at least 10 digits)
    if (!/^\d{10,}$/.test(student.number)) {
        alert("Number must be at least 10 digits.");
        return;
    }

    // Add student to table
    addStudentToTable(student);
    // reset the form
    event.target.reset();

    // Save to local storage with the help of student
    saveStudentToLocalStorage(student);
});

// Save student to local storage

function saveStudentToLocalStorage(student) {
    let students = JSON.parse(localStorage.getItem("students")) || [];
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));
}


// Load students from local storage and display in table on page load
window.addEventListener("DOMContentLoaded", function () {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    students.forEach(addStudentToTable);
});


function addStudentToTable(student) {
    const tableBody = document.getElementById("studentTableBody");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td data-label="Name">${student.name}</td>
        <td data-label="id">${student.id}</td>
        <td data-label="Email">${student.email}</td>
        <td data-label="Number">${student.number}</td>
        <td data-label="Action">
            <button class="action-btn edit-btn" onclick="editStudent(this)">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteStudent(this)">Delete</button>
        </td>
    `;
        
    tableBody.appendChild(row);
}

function editStudent(button) {
    const row = button.closest("tr");
    const name = row.cells[0].innerText;
    const id = row.cells[1].innerText;
    const email = row.cells[2].innerText;
    const number = row.cells[3].innerText;

    // Remove the old student from localStorage
    let students = JSON.parse(localStorage.getItem("students")) || [];
    students = students.filter(s => !(s.name === name && s.id === id && s.email === email && s.number === number));
    localStorage.setItem("students", JSON.stringify(students));

    const form = document.getElementById("studentForm");
    form.elements["name"].value = name;
    form.elements["id"].value = id;
    form.elements["email"].value = email;
    form.elements["number"].value = number;

    row.remove();
}

function deleteStudent(button) {
    if (confirm("Are you sure you want to delete this student?")) {
        const row = button.closest("tr");
        // Remove from local storage as well
        const name = row.cells[0].innerText;
        const id = row.cells[1].innerText;
        let students = JSON.parse(localStorage.getItem("students")) || [];
        students = students.filter(s => !(s.name === name && s.id === id));
        localStorage.setItem("students", JSON.stringify(students));
        row.remove();
    }
}
