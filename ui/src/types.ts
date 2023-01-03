export interface CrosswordCell {
  value?: string
  number?: number
}

export interface CrosswordBoard {
  id: string,
  title?: string,
  cells: CrosswordCell[][]
  date?: Date
}