"use client";

import { useState } from "react";
import { BiEdit, BiSave, BiTrash } from "react-icons/bi";

import { TTodo } from "@/types";

interface TodoItemProps {
  todo: TTodo;
  setTodos: (todos: TTodo[]) => void;
  todos: TTodo[];
}

const TodoItem = ({ todo, setTodos, todos }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(todo?.content || "");

  const handleEdit = () => {
    setValue(todo?.content || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      window.alert("내용을 입력해주세요.");
      return;
    }

    const newTodos = todos.map((t) =>
      t.id === todo.id ? { ...t, content: trimmedValue } : t
    );
    setTodos(newTodos);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!todo?.id) return;
    const newTodos = todos.filter((t) => t?.id !== todo?.id);
    setTodos(newTodos);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setValue(todo?.content || "");
    }
  };

  return (
    <div className="flex justify-between items-start gap-3 px-3 py-2 shadow-sm shadow-gray-300 border border-gray-300 rounded-md bg-white">
      {isEditing ? (
        <input
          type="text"
          className="w-full outline-none border-b border-gray-300 px-2"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
          maxLength={50}
        />
      ) : (
        <p className="break-all max-w-[250px] py-1">{todo?.content || ""}</p>
      )}
      <div className="flex gap-2 items-center">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BiSave className="text-xl text-blue-500 hover:text-blue-600" />
          </button>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <BiEdit className="text-xl text-green-500 hover:text-green-600" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <BiTrash className="text-xl text-red-500 hover:text-red-600" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
