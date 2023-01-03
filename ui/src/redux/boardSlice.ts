import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { CrosswordBoard } from '../types';
import type { RootState } from './store'

// Define the initial state using that type
interface CrosswordBoardState {
  status: string,
  board?: CrosswordBoard,
}

const initialState: CrosswordBoardState = {
  status: 'idle',
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchBoard = createAsyncThunk('board/fetchBoard', async (id: number) => {
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

  },
  extraReducers: (builder) => {
    builder
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

// Other code such as selectors can use the imported `RootState` type
export const selectBoard = (state: RootState) => state.crosswordBoard

export default boardSlice.reducer