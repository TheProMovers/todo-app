import { useState, useRef } from "react";
import { useTodoStore } from "../stores/todoStore";
import { motion } from "framer-motion";

const AddTodo = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createTodo } = useTodoStore();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTodo(title, image || undefined);
    setTitle("");
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white dark:bg-gray-900 shadow-lg rounded-xl"
    >
      <div className="flex items-center space-x-3">
        <motion.input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="할 일을 입력하세요..."
          className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 
                     text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
          whileFocus={{ scale: 1.05, borderColor: "#3b82f6" }}
        />
        <motion.button
          type="submit"
          className="px-5 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          추가
        </motion.button>
      </div>

      <div className="space-y-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                     rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          이미지 선택
        </label>
        {previewUrl && (
          <div className="relative w-32 h-32">
            <img
              src={previewUrl}
              alt="미리보기"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                setImage(null);
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
        )}
      </div>
    </motion.form>
  );
};

export default AddTodo;
