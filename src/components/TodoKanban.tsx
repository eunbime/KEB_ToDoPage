"use client";

import { useState, useCallback } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { TTodoBoard } from "@/types";
import { INITIAL_BOARDS, INITIAL_ORDER } from "@/constants/board";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import TodoBoard from "@/components/TodoBoard";

const TodoKanban = () => {
  const [boards, setBoards] = useState<TTodoBoard>(INITIAL_BOARDS);
  const [boardOrder, setBoardOrder] = useState<string[]>(INITIAL_ORDER);
  const [inputValue, setInputValue] = useState<string>("");

  const { mounted, saveBoard, deleteBoard, saveBoardOrder } = useLocalStorage({
    boards,
    setBoards,
    setBoardOrder,
  });

  const { handleDragEnd } = useDragAndDrop({
    boards,
    boardOrder,
    setBoards,
    setBoardOrder,
  });

  const handleAddBoard = useCallback(() => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      alert("보드 이름을 입력해주세요.");
      return;
    }

    const newBoardId = `board-${Date.now()}`;
    const newBoard = {
      title: trimmedValue,
      todos: [],
    };

    setBoards((prev) => ({
      ...prev,
      [newBoardId]: newBoard,
    }));

    const newOrder = [...boardOrder, newBoardId];
    setBoardOrder(newOrder);

    saveBoard(newBoardId, newBoard);
    saveBoardOrder(newOrder);
    setInputValue("");
  }, [inputValue, boardOrder, saveBoard, saveBoardOrder]);

  const handleDeleteBoard = (boardId: string) => {
    const newBoards = { ...boards };
    delete newBoards[boardId];
    setBoards(newBoards);
    localStorage.removeItem(boardId);

    const newOrder = boardOrder.filter((id) => id !== boardId);
    setBoardOrder(newOrder);

    deleteBoard(boardId);
    saveBoardOrder(newOrder);
  };

  const handleEditBoard = (boardId: string, newTitle: string) => {
    const newBoards = { ...boards };
    newBoards[boardId].title = newTitle;
    setBoards(newBoards);
    saveBoard(boardId, newBoards[boardId]);
  };

  if (!mounted) return null;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col w-full">
        <div className="flex w-full items-center justify-end gap-2 mb-4">
          <input
            type="text"
            placeholder="보드 이름"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="px-2 py-1 border rounded"
          />
          <button
            onClick={handleAddBoard}
            className="px-4 py-2 bg-gray-200 rounded-md hover:opacity-80"
          >
            보드 추가
          </button>
        </div>
        <Droppable droppableId="all-boards" type="BOARD" direction="horizontal">
          {(provided) => (
            <div
              className="flex w-full gap-4 md:flex-row flex-col"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {boardOrder.map(
                (boardId, index) =>
                  boards[boardId] && (
                    <TodoBoard
                      key={boardId}
                      listId={boardId}
                      index={index}
                      title={boards[boardId].title}
                      todos={boards[boardId].todos}
                      setTodos={(newTodos) => {
                        const updatedBoard = {
                          ...boards[boardId],
                          todos: newTodos,
                        };
                        setBoards((prev) => ({
                          ...prev,
                          [boardId]: updatedBoard,
                        }));
                        localStorage.setItem(
                          boardId,
                          JSON.stringify(updatedBoard)
                        );
                      }}
                      handleDeleteBoard={handleDeleteBoard}
                      handleEditBoard={handleEditBoard}
                    />
                  )
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default TodoKanban;
