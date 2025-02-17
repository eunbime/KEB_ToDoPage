"use client";

import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

import { TTodo, TTodoList } from "@/types";
import TodoList from "@/components/TodoList";

const TITLE_MAP: { [key: string]: string } = {
  todo: "할 일",
  inprogress: "진행 중",
  done: "완료",
};

const TodoKanban = () => {
  const [todoLists, setTodoLists] = useState<TTodoList>({});

  useEffect(() => {
    const savedTodo = localStorage.getItem("todo");
    const savedInProgress = localStorage.getItem("inprogress");
    const savedDone = localStorage.getItem("done");

    const newData = {
      todo: savedTodo ? JSON.parse(savedTodo) : [],
      inprogress: savedInProgress ? JSON.parse(savedInProgress) : [],
      done: savedDone ? JSON.parse(savedDone) : [],
    };

    setTodoLists(newData);
  }, []);

  const handleDragAndDrop = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList = Array.from(todoLists[source.droppableId]);
    const destList =
      source.droppableId === destination.droppableId
        ? sourceList
        : Array.from(todoLists[destination.droppableId]);

    const [removed] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, removed);

    const newTodoLists = {
      ...todoLists,
      [source.droppableId]: sourceList,
      ...(source.droppableId !== destination.droppableId && {
        [destination.droppableId]: destList,
      }),
    };

    setTodoLists(newTodoLists);

    localStorage.setItem(source.droppableId, JSON.stringify(sourceList));
    if (source.droppableId !== destination.droppableId) {
      localStorage.setItem(destination.droppableId, JSON.stringify(destList));
    }
  };

  const handleSetTodoList = (listId: string, newTodos: TTodo[]) => {
    setTodoLists((prev) => ({
      ...prev,
      [listId]: newTodos,
    }));
    localStorage.setItem(listId, JSON.stringify(newTodos));
  };

  return (
    <DragDropContext onDragEnd={handleDragAndDrop}>
      <div className="flex w-full gap-4 lg:flex-row flex-col">
        {Object.entries(todoLists).map(([listId, todos]) => (
          <TodoList
            key={listId}
            listId={listId}
            title={TITLE_MAP[listId]}
            todos={todos}
            setTodos={(newTodos) => {
              handleSetTodoList(listId, newTodos);
            }}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default TodoKanban;
