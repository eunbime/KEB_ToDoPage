import { TTodoBoard } from "@/types";

export const INITIAL_BOARDS: TTodoBoard = {
  "board-1": {
    title: "할 일",
    todos: [],
  },
  "board-2": {
    title: "진행 중",
    todos: [],
  },
  "board-3": {
    title: "완료",
    todos: [],
  },
};

export const INITIAL_ORDER = ["board-1", "board-2", "board-3"];
