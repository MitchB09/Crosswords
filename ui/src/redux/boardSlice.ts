import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../api'
import { CrosswordBoard, BoardMode, CrosswordCell } from '../types';
import type { RootState } from './store'

// Define the initial state using that type
interface CrosswordBoardState {
  status: string,
  board?: CrosswordBoard,
  boards: CrosswordBoard[],
  mode: BoardMode,
}

const initialState: CrosswordBoardState = {
  status: 'idle',
  mode: BoardMode.FILLING,
  boards: [],
}

export interface CellUpdate {
  row: number,
  column: number,
  cell: CrosswordCell,
}

export interface GetBoardRequest {
  id: string,
  shareCode?: string,
}

export interface UpdateBoardRequest {
  board: CrosswordBoard,
  shareCode?: string,
}

export const fetchBoards = createAsyncThunk('board/fetchBoards', async () => {
  const { data } = await api.get(`/boards`);
  return data;
});

export const fetchBoard = createAsyncThunk('board/fetchBoard', async (req: GetBoardRequest) => {
  const { id, shareCode } = req;
  let params = { }
  if (shareCode) {
    params = { ...params, shareCode: shareCode }
  }
  const { data } = await api.get(`/boards/${id}`, { params: params });
  return data;
});

export const postBoard = createAsyncThunk('board/postBoard', async (board: CrosswordBoard) => {
  const { data } = await api.post('/boards', board);
  board.id = data;
  return board;
});

export const putBoard = createAsyncThunk('board/putBoard', async (req: UpdateBoardRequest) => {
  const { board, shareCode } = req;
  let params = { }
  if (shareCode) {
    params = { ...params, shareCode: shareCode }
  }
  await api.put(`/boards/${board.id}`, board, { params: params });
  return board;
});

export const boardSlice = createSlice({
  name: 'board',
  initialState: initialState,
  reducers: {
    setMode: (state, action: PayloadAction<BoardMode>) => {
      state.mode = action.payload
    },
    updateCell: (state, action: PayloadAction<CellUpdate>) => {
      if (!state.board || !state.board.cells) {
        throw Error('No board selected for update');
      }

      const { row, column, cell } = action.payload;
      const { board } = state;

      if (board.cells) {
        board.cells[row][column] = cell;
      } else {
        throw Error('No board cells found for update');
      }

      state.board = board;
    },
    updateBoard: (state, action: PayloadAction<CrosswordBoard>) => {
      if (!state.board) {
        throw Error('No board selected for update');
      }
      state.board = action.payload;
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
        state.boards = [...state.boards, action.payload];
      })
      .addCase(postBoard.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(putBoard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(putBoard.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(putBoard.rejected, (state) => {
        state.status = 'failed';
      });
  },
})

// Action creators are generated for each case reducer function
export const { setMode, updateCell, updateBoard } = boardSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectBoard = (state: RootState) => state.crosswordBoard

export default boardSlice.reducer