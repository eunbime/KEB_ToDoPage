"use client";

import { useState } from "react";
import { BiEdit, BiPlus, BiSave, BiTrash } from "react-icons/bi";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

import { TTodo } from "@/types";
import TodoItem from "./TodoItem";

interface TodoBoardProps {
  listId: string;
  title: string;
  todos: TTodo[];
  index: number;
  setTodos: (todos: TTodo[]) => void;
  handleDeleteBoard: (boardId: string) => void;
  handleEditBoard: (boardId: string, newTitle: string) => void;
}

const TodoBoard = ({
  listId,
  title,
  todos = [],
  setTodos,
  index,
  handleDeleteBoard,
  handleEditBoard,
}: TodoBoardProps) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(title);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      window.alert("내용을 입력해주세요.");
      return;
    }

    const newTodo: TTodo = {
      id: uuidv4(),
      content: trimmedValue,
    };

    setTodos([newTodo, ...todos]);
    setValue("");
    setIsAdding(false);
  };

  return (
    <Draggable draggableId={listId} index={index}>
      {(draggableProvided) => (
        <div
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          className="flex flex-col gap-4 w-full max-w-[400px] min-w-[300px] min-h-[80vh] shadow-md shadow-gray-300 border-2 border-gray-300 rounded-md p-4"
        >
          <section
            className="flex justify-between items-center border-b-2 border-gray-300 pb-2"
            {...draggableProvided.dragHandleProps}
          >
            {isEditing ? (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full border-b-2 border-gray-300"
              />
            ) : (
              <h2 className="text-2xl font-bold">{title}</h2>
            )}
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
                placeholder="새로운 할일"
                autoFocus
              />
              <button type="submit">
                <BiPlus />
              </button>
            </form>
          )}

          <Droppable droppableId={listId} type="TODO">
            {(droppableProvided) => (
              <section
                className="flex flex-col gap-2 h-full"
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
              >
                {Array.isArray(todos) &&
                  todos.map((todo, index) => (
                    <Draggable
                      key={todo?.id || `todo-${index}`}
                      draggableId={todo?.id || `todo-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          key={todo?.id || `todo-${index}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TodoItem
                            todo={todo}
                            todos={todos}
                            setTodos={setTodos}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {droppableProvided.placeholder}
              </section>
            )}
          </Droppable>
          <div className="flex w-full justify-end gap-3">
            {isEditing ? (
              <button
                onClick={() => {
                  handleEditBoard(listId, inputValue);
                  setIsEditing(false);
                }}
              >
                <BiSave
                  size={20}
                  className="text-blue-500 hover:text-blue-600"
                />
              </button>
            ) : (
              <button onClick={() => setIsEditing((prev) => !prev)}>
                <BiEdit
                  size={20}
                  className="text-green-500 hover:text-green-600"
                />
              </button>
            )}
            <button onClick={() => handleDeleteBoard(listId)}>
              <BiTrash size={20} className="text-red-500 hover:text-red-600" />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TodoBoard;
