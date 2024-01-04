import React from "react";
import TextField from "@mui/material/TextField";
import { updateCell } from "../../redux/boardSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { BoardMode, CellIndex, CellMode, CrosswordCell } from "../../types";
import "./cell.css";

interface CellProps {
  cell: CrosswordCell;
  mode: BoardMode;
  index: CellIndex;
}

function Cell(props: CellProps) {
  const { cell, mode, index } = props;

  const dispatch = useAppDispatch();
  const { board } = useAppSelector((state) => state.crosswordBoard);

  const getClassByMode = (mode?: CellMode) => {
    switch (mode) {
      case CellMode.FILLED:
        return "block";
      case CellMode.CIRCLED:
        return "circled";
      case CellMode.SHADED:
        return "shaded";
      default:
        return "";
    }
  };

  if (mode === BoardMode.CONSTRUCTION) {
    if (cell.mode === CellMode.FILLED) {
      return (
        <div
          className="cell"
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            dispatch(
              updateCell({
                index,
                cell: { ...cell, mode: CellMode.CIRCLED },
              })
            );
          }}
        >
          <div className={getClassByMode(cell.mode)} />
        </div>
      );
    } else if (cell.mode === CellMode.CIRCLED) {
      return (
        <div
          className="cell"
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            dispatch(
              updateCell({
                index,
                cell: { ...cell, mode: CellMode.SHADED },
              })
            );
          }}
        >
          <div style={{ position: "relative", width: "0", height: "0" }}>
            <span className="number">{cell.number}</span>
          </div>
          <div className={getClassByMode(cell.mode)} />
        </div>
      );
    } else if (cell.mode === CellMode.SHADED) {
      return (
        <div
          className="cell"
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            dispatch(
              updateCell({ index, cell: { ...cell, mode: undefined } })
            );
          }}
        >
          <div style={{ position: "relative", width: "0", height: "0" }}>
            <span className="number">{cell.number}</span>
          </div>
          <div className={getClassByMode(cell.mode)} />
        </div>
      );
    } else if (cell.mode === undefined) {
      return (
        <div
          className="cell"
          onContextMenu={(event) => {
            event.preventDefault();
            event.stopPropagation();
            dispatch(
              updateCell({
                index,
                cell: { ...cell, mode: CellMode.FILLED },
              })
            );
          }}
        >
          <div style={{ position: "relative", width: "0", height: "0" }}>
            <span className="number">{cell.number}</span>
          </div>
          <div className={getClassByMode(cell.mode)} />
        </div>
      );
    } else {
      return <div />;
    }
  } else {
    if (cell.mode === CellMode.FILLED) {
      return (
        <div className="cell">
          <div className="block" />
        </div>
      );
    } else {
      return (
        <div className="cell">
          <div style={{ position: "relative", width: "0", height: "0" }}>
            <span className="number">{cell.number}</span>
          </div>
          <div className={getClassByMode(cell.mode)}>
            <TextField
              variant="filled"
              value={cell.value || ""}
              className="value"
              focused={(board?.selectedCell?.row === index.row && board?.selectedCell?.column === index.column)}
              inputRef={(input) => {
                if (input !== null && board?.selectedCell?.row === index.row && board?.selectedCell?.column === index.column) {
                  input.focus();
                }
              }}
              onChange={(event) => {
                const { target } = event;
                let { value: newValue } = target;
                newValue = newValue.toUpperCase();
                if (cell.value) {
                  newValue = newValue.replace(cell.value, "");
                }
                dispatch(
                  updateCell({
                    index,
                    cell: {
                      ...cell,
                      value: newValue.charAt(0),
                    },
                  })
                );
              }}
              inputProps={{
                className: "value",
              }}
              sx={{
                color: "success.main",
                "& .MuiInputBase-input": {
                  padding: "0px",
                  textAlign: "center",
                },
              }}
            />
          </div>
        </div>
      );
    }
  }
}

export default Cell;
