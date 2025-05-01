document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    document.getElementById("message").textContent = "Заповніть всі поля.";
    return;
  }

  const hashedPassword = CryptoJS.SHA256(password).toString();

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password: hashedPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("message").textContent = "Успішна реєстрація!";
      document.getElementById("registerForm").reset();
    } else {
      document.getElementById("message").textContent = data.error || "Помилка реєстрації.";
    }
  } catch (error) {
    console.error("Помилка при реєстрації:", error);
    document.getElementById("message").textContent = "Сталася помилка на сервері.";
  }
});
