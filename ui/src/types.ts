
export enum BoardMode {
  CONSTRUCTION,
  FILLING
}


export enum CellMode {
  FILLED,
  CIRCLED,
  SHADED,
}

export enum TabMode {
  ACROSS,
  DOWN,
}

export interface CrosswordCell {
  value?: string
  number?: number
  mode?: CellMode
  focused?: boolean
}

export interface CellIndex {
  row: number;
  column: number;
}

export interface CrosswordBoard {
  id?: string,
  userId: string,
  title?: string,
  cells?: CrosswordCell[][]
  crosswordDate?: Date | string,
  createdDate?: Date,
  lastUpdated?: Date,
  selectedCell?: CellIndex
  tabMode?: TabMode
}

export interface User {
  userId: string,
}