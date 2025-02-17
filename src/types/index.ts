export interface TTodo {
  id: string;
  content: string;
}

export interface TBoard {
  title: string;
  todos: TTodo[];
}

export interface TTodoBoard {
  [key: string]: TBoard;
}
