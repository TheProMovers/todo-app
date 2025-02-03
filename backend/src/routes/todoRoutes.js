const express = require("express");
const upload = require("../middleware/upload");
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");

const router = express.Router();

router.get("/", getTodos);
router.get("/:id", getTodoById);
router.post("/", upload.single("image"), createTodo);
router.put("/:id", upload.single("image"), updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;