import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { CrosswordBoard, BoardMode, CrosswordCell } from '../types';
import type { RootState } from './store'

// Define the initial state using that type
interface CrosswordBoardState {
  status: string,
  board?: CrosswordBoard,
  boards?: CrosswordBoard[],
  mode: BoardMode,
}

const initialState: CrosswordBoardState = {
  status: 'idle',
  mode: BoardMode.FILLING
}

export interface CellUpdate {
  row: number,
  column: number,
  cell: CrosswordCell,
}

export const fetchBoards = createAsyncThunk('board/fetchBoards', async () => {
  const { data } = await axios.get(`/boards`);
  return data;
});
export const fetchBoard = createAsyncThunk('board/fetchBoard', async (id: string) => {
  const { data } = await axios.get(`/boards/${id}`);
  return data;
});
export const postBoard = createAsyncThunk('board/postBoard', async (board: CrosswordBoard) => {
  const { data } = await axios.post('/boards', board);
  return data;
});

export const boardSlice = createSlice({
  name: 'board',
  initialState: initialState,
  reducers: {
    setMode: (state, action: PayloadAction<BoardMode>) => {
      state.mode = action.payload
    },
    updateCell: (state, action: PayloadAction<CellUpdate>) => {
      if (!state.board) {
        throw Error('No board selected for update');
      }
      const { row, column, cell } = action.payload;
      const { board } = state;

      board.cells[row][column] = cell;
      state.board = board;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.status = 'idle';
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(fetchBoard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.status = 'idle';
        state.board = action.payload;
      })
      .addCase(fetchBoard.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(postBoard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postBoard.fulfilled, (state, action) => {
        state.status = 'idle';
        state.board = action.payload;
      })
      .addCase(postBoard.rejected, (state) => {
        state.status = 'failed';
      });
  },
})

// Action creators are generated for each case reducer function
export const { setMode, updateCell } = boardSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectBoard = (state: RootState) => state.crosswordBoard

export default boardSlice.reducer