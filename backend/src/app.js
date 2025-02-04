const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// uploads 디렉토리가 없으면 생성
const uploadsDir = path.join(__dirname, "../uploads");
if (!require("fs").existsSync(uploadsDir)) {
  require("fs").mkdirSync(uploadsDir);
}

// 정적 파일 제공 설정
app.use("/api/uploads", express.static(uploadsDir));

app.get("/", (req, res) => {
  res.send("Todo API is running...");
});

// 라우터 추가
const todoRoutes = require("./routes/todoRoutes");
app.use("/api/todos", todoRoutes);

module.exports = app;