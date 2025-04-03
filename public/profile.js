document.addEventListener("DOMContentLoaded", async () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    const currentTheme = body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);
  });

  async function loadProfile() {
    try {
      const response = await fetch("/profile");
      if (response.status === 401) {
        window.location.href = "/";
        return;
      }
      const data = await response.json();
      document.getElementById("username").textContent =
        "Профиль " + data.user.username;
    } catch (err) {
      console.error(err);
    }
  }

  await loadProfile();

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
      const response = await fetch("/logout", { method: "POST" });
      const result = await response.json();
      if (result.success) {
        window.location.href = "/";
      } else {
        alert("Ошибка при выходе");
      }
    } catch (error) {
      alert("Ошибка сервера");
    }
  });

  document.getElementById("refreshData").addEventListener("click", async () => {
    try {
      const response = await fetch("/data");
      const result = await response.json();
      if (result.success) {
        const rnd = parseFloat(result.data.randomNumber).toFixed(4);
        document.getElementById("dataDisplay").textContent =
          "Случайное число: " + rnd + " (Источник: " + result.source + ")";
      } else {
        document.getElementById("dataDisplay").textContent =
          "Ошибка получения данных";
      }
    } catch (error) {
      document.getElementById("dataDisplay").textContent = "Ошибка сервера";
    }
  });
});
