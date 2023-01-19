import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Cell from "../cell";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchBoard,
  putBoard,
  updateBoard,
  setMode,
  deleteBoard,
} from "../../redux/boardSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { BoardMode, CellMode, CrosswordCell } from "../../types";
import "./board.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAuth } from "../../auth/hooks";
import { useSnackbar } from "../snackbar/hooks";

function Board() {
  const { id } = useParams();

  const { board, mode } = useAppSelector((state) => state.crosswordBoard);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const snackbar = useSnackbar();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const shareCode = searchParams.get("shareCode");

  useEffect(() => {
    if (id) {
      dispatch(fetchBoard({ id, shareCode: shareCode || undefined }));
    }
  }, [id, shareCode, dispatch]);

  return (
    <>
      <Typography variant="h5">{board?.title}</Typography>
      <Grid
        container
        direction="column"
        alignContent="center"
        justifyContent="center"
      >
        {board &&
          board.cells &&
          board.cells.map((row, rowIndex) => {
            return (
              <Grid
                key={`${rowIndex}`}
                item
                container
                direction="row"
                alignContent="center"
                justifyContent="center"
              >
                {row.map((cell, columnIndex) => {
                  return (
                    <Cell
                      key={`${rowIndex}.${columnIndex}`}
                      cell={cell}
                      mode={mode}
                      row={rowIndex}
                      column={columnIndex}
                    />
                  );
                })}
              </Grid>
            );
          })}
      </Grid>
      <Grid
        container
        direction="column"
        alignContent="stretch"
        justifyContent="center"
        spacing={1}
        style={{ width: "15em", margin: "0.1rem" }}
      >
        {mode === BoardMode.CONSTRUCTION && (
          <>
            <Grid item>
              <Button
                variant="contained"
                style={{ width: "100%" }}
                onClick={() => {
                  dispatch(setMode(BoardMode.FILLING));
                }}
              >
                Fill
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                style={{ width: "100%" }}
                onClick={() => {
                  if (board?.cells) {
                    const cells: CrosswordCell[][] = [];
                    let number = 1;
                    board.cells.forEach((row, rowIndex) => {
                      const newRow: CrosswordCell[] = [];
                      row.forEach((cell, colIndex) => {
                        let newCell: CrosswordCell;
                        if (
                          board.cells &&
                          //cell.value !== "-" && 
                          cell.mode !== CellMode.FILLED &&
                          (rowIndex === 0 ||
                            colIndex === 0 ||
                            board.cells[rowIndex - 1][colIndex].value === "-" ||
                            board.cells[rowIndex - 1][colIndex].mode === CellMode.FILLED ||
                            board.cells[rowIndex][colIndex - 1].value === "-" ||
                            board.cells[rowIndex][colIndex - 1].mode === CellMode.FILLED)
                        ) {
                          newCell = { ...cell, number: number };
                          number++;
                        } else {
                          newCell = { ...cell };
                        }
                        newRow.push(newCell);
                      });
                      cells.push(newRow);
                    });
                    dispatch(updateBoard({ ...board, cells: cells }));
                  }
                }}
              >
                Number
              </Button>
            </Grid>
          </>
        )}
        {user &&
          board &&
          user.getUsername() === board?.userId &&
          mode === BoardMode.FILLING && (
            <Grid item>
              <Button
                variant="contained"
                style={{ width: "100%" }}
                onClick={() => {
                  dispatch(setMode(BoardMode.CONSTRUCTION));
                }}
              >
                Construction
              </Button>
            </Grid>
          )}
        <Grid item>
          <Button
            variant="contained"
            style={{ width: "100%" }}
            onClick={() => {
              if (!board) {
                throw Error("No board selected");
              }
              dispatch(
                putBoard({ board, shareCode: shareCode || undefined })
              ).then(() => snackbar.addSuccess("Saved"));
            }}
          >
            Save
          </Button>
        </Grid>
        {user && board && user.getUsername() === board?.userId && (
          <>
            <Grid item>
              <Button
                variant="contained"
                style={{ width: "100%" }}
                onClick={() => {
                  navigator.clipboard
                    .writeText(
                      `${window.location}?shareCode=${btoa(
                        user?.getUsername()
                      )}`
                    )
                    .then(
                      () => {
                        snackbar.addSuccess("Copied");
                      },
                      () => {
                        snackbar.addError("Failed to Copy");
                      }
                    );
                }}
              >
                Share
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                style={{ width: "100%" }}
                onClick={() => {
                  if (!board || !board.id) {
                    throw Error("No board selected");
                  }
                  dispatch(
                    deleteBoard({ id: board.id })
                  ).then(() => navigate("/"));
                }}
              >
                Delete
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
}

export default Board;
