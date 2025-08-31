
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded - Initializing...");
    
    // Initialize displays
    updateStorageDisplay();
    updateCookieDisplay();
    
    
    const form = document.getElementById('studentForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        console.log("Form listener attached");
    }
    
    // Attach button handlers
    attachButton('saveToStorageBtn', saveToLocalStorage);
    attachButton('removeFromStorageBtn', removeFromLocalStorage);
    attachButton('setCookieBtn', setCookie);
    attachButton('checkCookieBtn', checkCookie);
    attachButton('clearCookieBtn', clearCookies);
    attachButton('extendCookieBtn', extendCookies);
});

// Helper function to attach button handlers
function attachButton(id, handler) {
    const button = document.getElementById(id);
    if (button) {
        button.addEventListener('click', handler);
        console.log(`Attached handler to ${id}`);
    } else {
        console.error(`Button ${id} not found!`);
    }
}

// ===== FORM HANDLING ===== //
function handleFormSubmit(e) {
    e.preventDefault();
    console.log("Form submitted");
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        studentId: document.getElementById('studentId').value.trim(),
        course: document.getElementById('course').value
    };
    
    // Create query string
    const queryParams = new URLSearchParams(formData);
    document.getElementById('queryStringOutput').textContent = 
        `Query String: ${queryParams.toString()}`;
    
    // Store for later use
    window.formData = formData;
    document.getElementById('saveToStorageBtn').disabled = false;
    
    console.log("Query string generated");
}

// ===== LOCAL STORAGE FUNCTIONS ===== //
function saveToLocalStorage() {
    console.log("Saving to localStorage");
    if (!window.formData) {
        alert("Submit form first!");
        return;
    }
    
    localStorage.setItem('formData', JSON.stringify(window.formData));
    updateStorageDisplay();
    alert("Data saved to localStorage!");
}

function removeFromLocalStorage() {
    console.log("Removing from localStorage");
    localStorage.removeItem('formData');
    updateStorageDisplay();
    alert("LocalStorage data removed!");
}

function updateStorageDisplay() {
    const data = localStorage.getItem('formData');
    const statusDiv = document.getElementById('storageStatus');
    
    if (data) {
        statusDiv.innerHTML = `<pre>${data}</pre>`;
    } else {
        statusDiv.innerHTML = '<p>No data in localStorage</p>';
    }
}

// ===== COOKIE FUNCTIONS ===== //
function setCookie() {
    console.log("Setting cookies");
    const data = localStorage.getItem('formData');
    if (!data) {
        alert("No data in localStorage! Save form data first.");
        return;
    }
    
    try {
        const formData = JSON.parse(data);
        
        // Set cookies with 1 hour expiration
        setCookieValue('studentName', formData.name);
        setCookieValue('studentEmail', formData.email);
        setCookieValue('studentId', formData.studentId);
        setCookieValue('studentCourse', formData.course); // FIXED: lowercase 'course'
        
        updateCookieDisplay();
        alert("Cookies set successfully! Check the cookie section.");
    } catch (error) {
        console.error("Cookie error:", error);
        alert("Error setting cookies: " + error.message);
    }
}

function setCookieValue(name, value) {
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + 60 * 60 * 1000); // 1 hour
    const expires = "expires=" + expiration.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
}

function checkCookie() {
    console.log("Checking cookies");
    updateCookieDisplay();
    alert("Cookie check completed! See results below.");
}

function clearCookies() {
    console.log("Clearing cookies");
    // Clear all cookies
    clearCookie('studentName');
    clearCookie('studentEmail');
    clearCookie('studentId');
    clearCookie('studentCourse');
    
    updateCookieDisplay();
    alert("All cookies cleared!");
}

function clearCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function extendCookies() {
    console.log("Extending cookies");
    const cookies = document.cookie.split(';');
    let extended = false;
    
    for (const cookie of cookies) {
        const parts = cookie.trim().split('=');
        if (parts.length >= 2) {
            const name = parts[0];
            const value = parts.slice(1).join('='); // Handle values with '='
            const newExpiry = new Date();
            newExpiry.setTime(newExpiry.getTime() + 2 * 60 * 60 * 1000); // +2 hours
            document.cookie = `${name}=${value}; expires=${newExpiry.toUTCString()}; path=/`;
            extended = true;
        }
    }
    
    if (extended) {
        updateCookieDisplay();
        alert("Cookies extended by 2 hours!");
    } else {
        alert("No cookies to extend! Set cookies first.");
    }
}

function updateCookieDisplay() {
    console.log("Updating cookie display");
    const cookies = document.cookie;
    const statusDiv = document.getElementById('cookieStatus');
    
    if (cookies) {
        statusDiv.innerHTML = `
            <h3>Active Cookies:</h3>
            <pre>${formatCookiesForDisplay(cookies)}</pre>
        `;
    } else {
        statusDiv.innerHTML = '<p>No active cookies</p>';
    }
}

function formatCookiesForDisplay(cookieString) {
    return cookieString.split(';')
        .map(cookie => {
            const parts = cookie.trim().split('=');
            const name = parts[0];
            const value = parts.slice(1).join('='); // Handle values with '='
            return `${name}=${decodeURIComponent(value)}`;
        })
        .join('\n');
}