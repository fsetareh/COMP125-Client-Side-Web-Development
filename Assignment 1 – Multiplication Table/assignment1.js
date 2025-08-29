function drawTable() {
    const rows = parseInt(document.getElementById("rows").value);
    const cols = parseInt(document.getElementById("cols").value);
    const container = document.getElementById("table-container");

    let table = "<table>";
    for (let i = 1; i <= rows; i++) {
        table += "<tr>";
        for (let j = 1; j <= cols; j++) {
            table += `<td>${i * j}</td>`;
        }
        table += "</tr>";
    }
    table += "</table>";

    container.innerHTML = table;
}

// Draw initial 10x10 table on page load
window.onload = drawTable;
