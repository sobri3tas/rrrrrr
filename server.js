const express = require("express");
const session = require("express-session");
const path = require("path");
const HashService = require("./hashService");
const User = require("./user");
const { getCachedData, setCachedData } = require("./cacheService");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "my_best_secret_key_here",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const users = [];

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (users.find((u) => u.username === username)) {
    return res
      .status(400)
      .json({ success: false, message: "Пользователь уже существует" });
  }

  const newUser = new User(username);
  await newUser.setPassword(password);
  users.push(newUser);

  res.json({ success: true, message: "Регистрация успешна" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Неверный логин или пароль",
    });
  }

  const isValid = await user.checkPassword(password);
  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: "Неверный логин или пароль",
    });
  }

  req.session.user = { username: user.username };
  res.json({ success: true, message: "Вход выполнен" });
});

function authMiddleware(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
}

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Доступ к профилю",
    user: req.session.user,
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Ошибка выхода" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Вы успешно вышли" });
  });
});

app.get("/data", async (req, res) => {
  try {
    let data = await getCachedData();
    if (data) {
      return res.json({ success: true, source: "cache", data });
    }
    data = { timestamp: new Date(), randomNumber: Math.random() };
    await setCachedData(data);
    res.json({ success: true, source: "generated", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

app.listen(3000, () => {
  console.log("Сервер запущен на http://localhost:3000");
});
