import { useState } from "react";
import { useTodoStore } from "../stores/todoStore";
import { motion, AnimatePresence } from "framer-motion";

const TodoList = () => {
  const { todos, toggleTodo, removeTodo, editTodo, filter, setFilter } = useTodoStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditText(title);
  };

  const handleSaveEdit = (id: string) => {
    editTodo(id, editText);
    setEditingId(null);
  };

  // ✅ 필터링된 할 일 목록
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="mt-6 space-y-3">
      {/* ✅ 필터 버튼 추가 */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          전체
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1 rounded ${filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          진행 중
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          완료됨
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gray-500"
        >
          할 일이 없습니다.
        </motion.p>
      ) : (
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <motion.div
              key={todo._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id, !todo.completed)}
                className="mr-3 w-5 h-5 accent-green-500"
              />

              {editingId === todo._id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="px-2 py-1 border rounded w-full"
                />
              ) : (
                <span className={todo.completed ? "line-through text-gray-500" : "text-gray-900"}>
                  {todo.title}
                </span>
              )}

              {editingId === todo._id ? (
                <motion.button
                  onClick={() => handleSaveEdit(todo._id)}
                  className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition"
                >
                  저장
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => handleEdit(todo._id, todo.title)}
                  className="px-3 py-1 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600 transition"
                >
                  수정
                </motion.button>
              )}

              <motion.button
                onClick={() => removeTodo(todo._id)}
                className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition"
              >
                삭제
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default TodoList;
