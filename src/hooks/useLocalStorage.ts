import { TBoard, TTodoBoard } from "@/types";
import { useEffect, useState } from "react";

interface UseLocalStorageProps {
  boards: TTodoBoard;
  setBoards: (value: TTodoBoard) => void;
  setBoardOrder: (value: string[]) => void;
}

export const useLocalStorage = ({
  boards,
  setBoards,
  setBoardOrder,
}: UseLocalStorageProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem("boardOrder");
      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        const savedBoards: TTodoBoard = { ...boards };

        parsedOrder.forEach((boardId: string) => {
          const savedBoard = localStorage.getItem(boardId);
          if (savedBoard) {
            savedBoards[boardId] = JSON.parse(savedBoard);
          }
        });

        if (Object.keys(savedBoards).length > 0) {
          setBoards(savedBoards);
          setBoardOrder(parsedOrder);
        }
      }
    } catch (error) {
      console.error("Failed to load saved data:", error);
    }
    setMounted(true);
  }, []);

  const saveBoard = (boarderId: string, board: TBoard) => {
    localStorage.setItem(boarderId, JSON.stringify(board));
  };

  const saveBoardOrder = (boardOrder: string[]) => {
    localStorage.setItem("boardOrder", JSON.stringify(boardOrder));
  };

  const deleteBoard = (boardId: string) => {
    localStorage.removeItem(boardId);
  };

  return { mounted, saveBoard, saveBoardOrder, deleteBoard };
};
