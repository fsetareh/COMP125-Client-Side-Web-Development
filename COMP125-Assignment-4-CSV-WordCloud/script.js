function handleFileUpload()
 {
    const input = document.getElementById('fileInput');
    const file = input.files[0];
    const message = document.getElementById('message');

    if (!file) {
        message.textContent = "Please select a file first.";
        return;
    }

    if (!file.name.endsWith('.csv')) {
        message.textContent = "Please upload a valid CSV file.";
        input.value = '';
        return;
    }

    message.textContent = "CSV file is valid. Ready for conversion.";

    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        const json = csvToJson(text);
       downloadJson(json, file.name.replace('.csv', '.json'));
displayTableAndChart(text); // Add this line;
    };
    reader.readAsText(file);
}

function csvToJson(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",");
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(",");

        headers.forEach((header, index) => {
            obj[header.trim()] = currentLine[index].trim();
        });

        result.push(obj);
    }

    return JSON.stringify(result, null, 2);
}

function downloadJson(jsonData, filename) {
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
function displayTableAndChart(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",");
    const tableData = lines.slice(1).map(line => line.split(","));

    // Create Table
    let html = "<table><thead><tr>";
    headers.forEach(h => html += `<th>${h}</th>`);
    html += "</tr></thead><tbody>";

    tableData.forEach(row => {
        html += "<tr>";
        row.forEach(cell => html += `<td>${cell}</td>`);
        html += "</tr>";
    });
    html += "</tbody></table>";
    document.getElementById("tableContainer").innerHTML = html;

    // Create Chart
    const labels = tableData.map(row => row[0]); // language names
    const data2022 = tableData.map(row => parseFloat(row[1])); // 2022
    const data2023 = tableData.map(row => parseFloat(row[2])); // 2023

    const ctx = document.getElementById("chartContainer").getContext("2d");
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '2022',
                    data: data2022,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)'
                },
                {
                    label: '2023',
                    data: data2023,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Programming Language Popularity (2022 vs 2023)'
                }
            }
        }
    });
}
function generateWordCloud() {
    const url = document.getElementById('urlInput').value;
    const output = document.getElementById('wordCloudMessage');
    const canvas = document.getElementById('wordCloudCanvas');

    output.textContent = '';

    if (!url.startsWith('http')) {
        output.textContent = "Please enter a valid URL starting with http or https.";
        return;
    }

    fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch URL content.");
            return response.text();
        })
        .then(text => {
            const words = text.replace(/<[^>]*>/g, '') // remove HTML
                              .replace(/[^\w\s]/g, '') // remove punctuation
                              .toLowerCase()
                              .split(/\s+/);

            const freqMap = {};
            words.forEach(word => {
                if (word.length > 3) {
                    freqMap[word] = (freqMap[word] || 0) + 1;
                }
            });

            const wordArray = Object.entries(freqMap);
            WordCloud(canvas, { list: wordArray });
        })
        .catch(error => {
            output.textContent = "Error: " + error.message;
        });
}
