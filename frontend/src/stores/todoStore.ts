import { create } from "zustand";
import { Todo } from "../types/todo";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../apis/todoApi";

interface TodoStore {
  todos: Todo[];
  filter: "all" | "active" | "completed"; // ✅ 필터 추가
  setFilter: (filter: "all" | "active" | "completed") => void;
  loadTodos: () => Promise<void>;
  createTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  removeTodo: (id: string) => Promise<void>;
  editTodo: (id: string, title: string) => Promise<void>;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  filter: "all", // ✅ 기본 필터는 "all"

  setFilter: (filter) => set({ filter }),

  loadTodos: async () => {
    const todos = await fetchTodos();
    set({ todos });
  },

  createTodo: async (title) => {
    const newTodo = await addTodo(title);
    set((state) => ({ todos: [...state.todos, newTodo] }));
  },

  toggleTodo: async (id, completed) => {
    const updatedTodo = await updateTodo(id, { completed });
    set((state) => ({
      todos: state.todos.map((todo) => (todo._id === id ? updatedTodo : todo)),
    }));
  },

  removeTodo: async (id) => {
    await deleteTodo(id);
    set((state) => ({ todos: state.todos.filter((todo) => todo._id !== id) }));
  },

  editTodo: async (id, title) => {
    const updatedTodo = await updateTodo(id, { title });
    set((state) => ({
      todos: state.todos.map((todo) => (todo._id === id ? updatedTodo : todo)),
    }));
  },
}));
