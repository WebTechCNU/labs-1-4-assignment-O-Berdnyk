document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  if (token) {

    document.getElementById("message").textContent = "Ви вже увійшли";

    document.getElementById("username").disabled = true;
    document.getElementById("password").disabled = true;
    document.getElementById("login-btn").disabled = true; 
    
    return; 
  }

  document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const hashedPassword = CryptoJS.SHA256(password).toString();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password: hashedPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        document.getElementById("message").textContent = "Успішний вхід!";
        document.getElementById("username").disabled = true;
        document.getElementById("password").disabled = true;
        document.getElementById("login-btn").disabled = true;
      } else {
        document.getElementById("message").textContent = data.error || "Помилка входу";
      }
    } catch (error) {
      document.getElementById("message").textContent = "Помилка з'єднання з сервером";
    }
  });
});
