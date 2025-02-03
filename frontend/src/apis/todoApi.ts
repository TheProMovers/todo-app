import axios from "axios";
import { Todo } from "../types/todo";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(`${API_URL}/todos`);
  return response.data;
};

export const addTodo = async (title: string, image?: File): Promise<Todo> => {
  const formData = new FormData();
  formData.append("title", title);
  if (image) {
    formData.append("image", image);
  }
  const response = await axios.post(`${API_URL}/todos`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateTodo = async (id: string, data: Partial<Todo>, image?: File): Promise<Todo> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value as string);
  });
  if (image) {
    formData.append("image", image);
  }
  const response = await axios.put(`${API_URL}/todos/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/todos/${id}`);
};
