"use client";

import { useState } from "react";
import { BiEdit, BiSave, BiTrash } from "react-icons/bi";

interface TodoItemProps {
  title: string;
  todo: string;
  setTodos: React.Dispatch<React.SetStateAction<string[]>>;
  todos: string[];
  index: number;
}

const TodoItem = ({ title, todo, setTodos, todos, index }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const handleEdit = () => {
    setValue(todo);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!value.trim()) return;
    const newTodos = todos.map((t, i) => (i === index ? value : t));
    setTodos(newTodos);
    localStorage.setItem(title, JSON.stringify(newTodos));
    setValue("");
    setIsEditing(false);
  };

  const handleDelete = () => {
    const newTodos = todos.filter((t, i) => i !== index);
    setTodos(newTodos);
    localStorage.setItem(title, JSON.stringify(newTodos));
  };

  return (
    <div className="flex justify-between items-start gap-3 px-3 py-2 shadow-md shadow-gray-300 rounded-md">
      {isEditing ? (
        <input
          type="text"
          className="w-full outline-none border-b border-gray-300 px-2"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSave()}
          autoFocus
          maxLength={50}
        />
      ) : (
        <p className="break-all max-w-[250px]">{todo}</p>
      )}
      <div className="flex gap-2">
        {isEditing ? (
          <button onClick={handleSave}>
            <BiSave className="text-xl text-blue-500 hover:text-blue-600" />
          </button>
        ) : (
          <>
            <button onClick={handleEdit}>
              <BiEdit className="text-xl text-green-500 hover:text-green-600" />
            </button>
            <button onClick={handleDelete}>
              <BiTrash className="text-xl text-red-500 hover:text-red-600" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
