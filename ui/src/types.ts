export interface CrosswordCell {
  value?: string
  number?: number
}

export interface CrosswordBoard {
  id: string,
  userId: string,
  title?: string,
  cells: CrosswordCell[][]
  date?: Date
}

export enum BoardMode {
  CONSTRUCTION,
  FILLING
}

export interface User {
  userId: string,
}