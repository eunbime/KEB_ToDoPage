"use client";

import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import TodoItem from "./TodoItem";

interface TodoListProps {
  title: string;
}

const TodoList = ({ title }: TodoListProps) => {
  const [todos, setTodos] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem(title) || "[]");
    if (savedTodos.length > 0) {
      setTodos(savedTodos);
    }
  }, [title]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTodos((prev) => [value, ...prev]);
    localStorage.setItem(title, JSON.stringify([value, ...todos]));
    setValue("");
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col gap-4 w-1/3 min-h-[90vh] shadow-md shadow-gray-300 border-2 border-gray-300 rounded-md p-4">
      <section className="flex justify-between items-center border-b-2 border-gray-300 pb-2">
        <h2 className="text-2xl font-bold ">
          {title === "todo"
            ? "todo"
            : title === "inProgress"
            ? "inProgress"
            : "done"}
        </h2>
        <button className="px-2 py-1 rounded-md">
          <BiPlus
            size={20}
            onClick={() => setIsAdding((prev) => !prev)}
            className="cursor-pointer"
          />
        </button>
      </section>
      {isAdding && (
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border-b-2 border-gray-300"
            maxLength={50}
          />
          <button type="submit">
            <BiPlus />
          </button>
        </form>
      )}

      {todos.map((item, index) => (
        <TodoItem
          key={index}
          index={index}
          title={title}
          todo={item}
          setTodos={setTodos}
          todos={todos}
        />
      ))}
    </div>
  );
};

export default TodoList;
