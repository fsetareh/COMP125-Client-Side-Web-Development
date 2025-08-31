document.getElementById("calendarForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const monthInput = document.getElementById("monthInput");
  const classLength = document.getElementById("classLength");

  const monthVal = monthInput.value.trim();
  const classLengthVal = parseInt(classLength.value.trim());

  // Reset custom messages
  monthInput.setCustomValidity("");
  classLength.setCustomValidity("");

  let isValid = true;

  if (!/^\d{6}$/.test(monthVal)) {
    monthInput.setCustomValidity("Please enter a valid month in MMYYYY format.");
    isValid = false;
  }

  if (!(classLengthVal >= 1 && classLengthVal <= 3)) {
    classLength.setCustomValidity("Class length must be between 1 and 3 hours.");
    isValid = false;
  }

  if (!monthInput.checkValidity() || !classLength.checkValidity()) {
    monthInput.reportValidity();
    classLength.reportValidity();
    return;
  }

  generateCalendar(monthVal);
});

function generateCalendar(mmYYYY) {
  const month = parseInt(mmYYYY.substring(0, 2)) - 1;
  const year = parseInt(mmYYYY.substring(2));

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarTable = document.createElement("table");
  const headerRow = calendarTable.insertRow();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  days.forEach(day => {
    const th = document.createElement("th");
    th.textContent = day;
    headerRow.appendChild(th);
  });

  let row = calendarTable.insertRow();
  for (let i = 0; i < firstDay.getDay(); i++) {
    row.insertCell();
  }

  for (let date = 1; date <= daysInMonth; date++) {
    const currentDate = new Date(year, month, date);
    if (row.cells.length === 7) row = calendarTable.insertRow();
    
    const cell = row.insertCell();
    cell.textContent = date;

    // Add classes
    const day = currentDate.getDay();
    const week = Math.floor((date + firstDay.getDay() - 1) / 7) + 1;

    if (day === 1) cell.className = "theory"; // Monday
    else if (day === 4) cell.className = "lab"; // Thursday
    else if (day === 6 && (week === 2 || week === 3)) {
      cell.className = "makeup";
      cell.textContent = `${date}\nMake-Up Class`;
    }
  }

  const container = document.getElementById("calendarContainer");
  container.innerHTML = "";
  container.appendChild(calendarTable);
}
