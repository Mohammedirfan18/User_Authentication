const API_BASE_URL = "http://localhost:4000/users"; // Update with your backend URL

// Register User
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    document.getElementById("message").innerText = data.message || "Registered successfully! Check email for verification.";
});

// Login User
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success) {
        document.getElementById("message").innerText = "Login Successful!";
        localStorage.setItem("authToken", data.token); // Store token
    } else {
        document.getElementById("message").innerText = "Login Failed! " + (data.message || "");
    }
});

// Verify Email
document.getElementById("verifyForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = document.getElementById("verifyToken").value;

    const response = await fetch(`${API_BASE_URL}/verify/${token}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    document.getElementById("message").innerText = data.message || "Verification successful!";
});
