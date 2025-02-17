"use client";

import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

import { TTodo } from "@/types";
import TodoItem from "@/components/TodoItem";

interface TodoListProps {
  listId: string;
  title: string;
  todos: TTodo[];
  setTodos: (todos: TTodo[]) => void;
}

const TodoList = ({ listId, title, todos, setTodos }: TodoListProps) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim()) {
      window.alert("내용을 입력해주세요.");
      return;
    }

    const newTodo = { id: uuidv4(), content: value };
    setTodos([newTodo, ...todos]);
    setValue("");
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full min-h-[90vh] shadow-md shadow-gray-300 border-2 border-gray-300 rounded-md p-4">
      <section className="flex justify-between items-center border-b-2 border-gray-300 pb-2">
        <h2 className="text-2xl font-bold capitalize">{title}</h2>
        <button onClick={() => setIsAdding((prev) => !prev)}>
          <BiPlus size={20} />
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
            autoFocus
          />
          <button type="submit">
            <BiPlus />
          </button>
        </form>
      )}
      <Droppable droppableId={listId}>
        {(provided) => (
          <section
            className="flex flex-col gap-2 h-full"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TodoItem
                      todo={todo}
                      index={index}
                      todos={todos}
                      setTodos={setTodos}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </section>
        )}
      </Droppable>
    </div>
  );
};

export default TodoList;
