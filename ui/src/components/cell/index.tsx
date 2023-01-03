import React from "react";
import TextField from "@mui/material/TextField";
import { updateCell } from "../../redux/boardSlice";
import { useAppDispatch } from "../../redux/hooks";
import { BoardMode, CrosswordCell } from "../../types";
import "./cell.css";

interface CellProps {
  cell: CrosswordCell,
  mode: BoardMode,
  row: number,
  column: number
}

function Cell(props: CellProps) {
  const { cell, mode, row, column } = props;

  const dispatch = useAppDispatch();

  if (mode === BoardMode.CONSTRUCTION) {
    if (cell.value === '-') {
      return (
        <div
          className="cell"
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            dispatch(updateCell({ row, column, cell: { ...cell, value: '' }}))
          }}
        >
          <div className="block" />
        </div>
      )
    } else {
      return (
        <div
          className="cell"
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            dispatch(updateCell({ row, column, cell: { ...cell, value: '-' }}))
          }}
        >
          <TextField
            variant="filled"
            value={cell.number}
            className="value"
            onChange={(event) => {
              const val = event.target.value;
              if (val === '') {
                dispatch(updateCell({ row, column, cell: { ...cell, number: undefined }}))
              } else {
                dispatch(updateCell({ row, column, cell: { ...cell, number: isNaN(+event.target.value) ? 1 : +event.target.value }}))
              }
            }}
            inputProps={{ maxLength: 3 }}
            sx={{
              height: '2em',
              width: '2em',
              color: 'success.main',
              '& .MuiInputBase-input': {
                padding: '0px',
                height: '2em',
                textAlign: 'center',
              },
            }}
          />
        </div>
      )
    }
  } else {
    if (cell.value === '-') {
      return (
        <div className="cell">
          <div className="block" />
        </div>
      )
    } else {
      return (
        <div className="cell">
          <div style={{ position: 'relative', width: '0', height: '0' }}><span className="number">{cell.number}</span></div>
          <TextField
            variant="filled"
            value={cell.value}
            className="value"
            onChange={(event) => {
              dispatch(updateCell({ row, column, cell: { ...cell, value: event.target.value.charAt(event.target.value.length - 1).toUpperCase() }}))

            }}
            sx={{
              height: '2em',
              width: '2em',
              color: 'success.main',
              '& .MuiInputBase-input': {
                padding: '0px',
                height: '2em',
                textAlign: 'center',
              },
            }}
          />
        </div>
      )
    }
  }
}

export default Cell;