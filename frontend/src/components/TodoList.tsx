import { useState, useRef } from "react";
import { useTodoStore } from "../stores/todoStore";
import { motion, AnimatePresence } from "framer-motion";

const TodoList = () => {
  const { todos, toggleTodo, removeTodo, editTodo, filter, setFilter } = useTodoStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sortOrder, setSortOrder] = useState<"oldest" | "newest">("oldest"); // ✅ 정렬 상태 추가

  const handleEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditText(title);
    setEditImage(null);
    setPreviewUrl(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (editText.trim() !== "") {
      await editTodo(id, editText, editImage || undefined);
      setEditingId(null);
      setEditImage(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ✅ 필터링된 할 일 목록
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // ✅ 정렬된 할 일 목록
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortOrder === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className="mt-6 space-y-3">
      {/* ✅ 필터 + 정렬 버튼 */}
      <div className="flex justify-between mb-4">
        {/* 필터 버튼 */}
        <div className="flex gap-2">
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

        {/* 정렬 버튼 */}
        <button
          onClick={() => setSortOrder(sortOrder === "oldest" ? "newest" : "oldest")}
          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
        >
          {sortOrder === "oldest" ? "최신순" : "오래된순"}
        </button>
      </div>

      {sortedTodos.length === 0 ? (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gray-500"
        >
          할 일이 없습니다.
        </motion.p>
      ) : (
        <AnimatePresence>
          {sortedTodos.map((todo) => (
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

              <div className="flex-1">
                {editingId === todo._id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="px-2 py-1 border rounded w-full"
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="hidden"
                        id={`edit-image-${todo._id}`}
                      />
                      <label
                        htmlFor={`edit-image-${todo._id}`}
                        className="inline-block px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 
                                 rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                      >
                        이미지 변경
                      </label>
                      {previewUrl ? (
                        <div className="relative w-32 h-32 mt-2">
                          <img
                            src={previewUrl}
                            alt="미리보기"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditImage(null);
                              setPreviewUrl(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = "";
                              }
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full 
                                     flex items-center justify-center hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ) : todo.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${todo.imageUrl}`}
                            alt="현재 이미지"
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className={todo.completed ? "line-through text-gray-500" : "text-gray-900"}>
                      {todo.title}
                    </span>
                    {todo.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${todo.imageUrl}`}
                          alt="할 일 이미지"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

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
