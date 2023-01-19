
export enum BoardMode {
  CONSTRUCTION,
  FILLING
}


export enum CellMode {
  FILLED,
  CIRCLED,
  SHADED,
}

export interface CrosswordCell {
  value?: string
  number?: number
  mode?: CellMode
}

export interface CrosswordBoard {
  id?: string,
  userId: string,
  title?: string,
  cells?: CrosswordCell[][]
  date?: Date,
  createdDate?: Date,
  lastUpdated?: Date,
}

export interface User {
  userId: string,
}