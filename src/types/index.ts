export interface TTodo {
  id: string;
  content: string;
}

export interface TTodoList {
  [key: string]: TTodo[];
}
