import { TTodoBoard } from "@/types";
import { DropResult } from "@hello-pangea/dnd";
import { useCallback } from "react";

interface UseDragAndDropProps {
  boards: TTodoBoard;
  boardOrder: string[];
  setBoards: (value: TTodoBoard) => void;
  setBoardOrder: (value: string[]) => void;
}

export const useDragAndDrop = ({
  boards,
  boardOrder,
  setBoards,
  setBoardOrder,
}: UseDragAndDropProps) => {
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, type } = result;
      if (!destination) return;

      // 보드 순서 변경
      if (type === "BOARD") {
        const newOrder = Array.from(boardOrder);
        const [removed] = newOrder.splice(source.index, 1);
        newOrder.splice(destination.index, 0, removed);
        setBoardOrder(newOrder);
        localStorage.setItem("boardOrder", JSON.stringify(newOrder));
        return;
      }

      // 같은 위치로 드래그한 경우
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      const start = boards[source.droppableId];
      const finish = boards[destination.droppableId];

      if (!start || !finish) return;

      // 같은 보드 내에서 이동
      if (source.droppableId === destination.droppableId) {
        const newTodos = Array.from(start.todos);
        const [removed] = newTodos.splice(source.index, 1);
        newTodos.splice(destination.index, 0, removed);

        const newBoards = {
          ...boards,
          [source.droppableId]: {
            ...start,
            todos: newTodos,
          },
        };

        setBoards(newBoards);
        localStorage.setItem(
          source.droppableId,
          JSON.stringify(newBoards[source.droppableId])
        );
        return;
      }

      const startTodos = Array.from(start.todos);
      const [removed] = startTodos.splice(source.index, 1);
      const finishTodos = Array.from(finish.todos);
      finishTodos.splice(destination.index, 0, removed);

      const newBoards = {
        ...boards,
        [source.droppableId]: {
          ...start,
          todos: startTodos,
        },
        [destination.droppableId]: {
          ...finish,
          todos: finishTodos,
        },
      };

      setBoards(newBoards);
      localStorage.setItem(
        source.droppableId,
        JSON.stringify(newBoards[source.droppableId])
      );
      localStorage.setItem(
        destination.droppableId,
        JSON.stringify(newBoards[destination.droppableId])
      );
    },
    [boards, boardOrder]
  );

  return { handleDragEnd };
};
