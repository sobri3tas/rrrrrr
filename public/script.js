document.addEventListener("DOMContentLoaded", () => {
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const messageEl = document.getElementById("message");

  function showMessage(msg, isError = true) {
    messageEl.textContent = msg;
    messageEl.style.color = isError ? "#d9534f" : "#5cb85c";
  }

  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.style.display = "flex";
    registerForm.style.display = "none";
    showMessage("");
  });
  
  registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.style.display = "flex";
    loginForm.style.display = "none";
    showMessage("");
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (result.success) {
        showMessage("Вход выполнен.", false);
        setTimeout(() => {
          window.location.href = "/profile.html";
        }, 1000);
      } else {
        showMessage(result.message || "Ошибка входа");
      }
    } catch (error) {
      showMessage("Ошибка сервера");
    }
  });

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (result.success) {
      } else {
        showMessage(result.message || "Ошибка регистрации");
      }
    } catch (error) {
      showMessage("Ошибка сервера");
    }
  });
});