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
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker/DatePicker";
import startOfDay from "date-fns/startOfDay";
import format from "date-fns/format";

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
      {board && mode === BoardMode.CONSTRUCTION && (
        <Grid
          container
          direction="column"
          alignContent="center"
          justifyContent="center"
          spacing={2}
          style={{ margin: "1em" }}
        >
          {board.crosswordDate && (
            <Grid item>
              <DatePicker
                label="Crossword Date"
                value={board.crosswordDate || new Date()}
                onChange={(newValue: Date | null) => {
                  if (newValue) {
                    dispatch(
                      updateBoard({
                        ...board,
                        crosswordDate:
                          startOfDay(newValue).toJSON() || undefined,
                      })
                    );
                  }
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Grid>
          )}
          {board?.title && (
            <Grid item>
              <TextField
                variant="filled"
                value={board?.title || ""}
                onChange={(event) => {
                  dispatch(
                    updateBoard({ ...board, title: event.target.value })
                  );
                }}
                sx={{
                  width: "15em",
                  color: "success.main",
                  "& .MuiInputBase-input": {
                    textAlign: "center",
                  },
                }}
              />
            </Grid>
          )}
        </Grid>
      )}
      {mode === BoardMode.FILLING && (
        <Typography variant="h5">
          {board?.title}{" "}
          {board?.crosswordDate &&
            format(new Date(board?.crosswordDate), "EEEE, MMMM do yyyy")}
        </Typography>
      )}
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
                          cell.mode !== CellMode.FILLED &&
                          (rowIndex === 0 ||
                            colIndex === 0 ||
                            board.cells[rowIndex - 1][colIndex].mode ===
                              CellMode.FILLED ||
                            board.cells[rowIndex][colIndex - 1].mode ===
                              CellMode.FILLED)
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
              dispatch(putBoard({ board, shareCode: shareCode || undefined }))
                .unwrap()
                .then(() => snackbar.addSuccess("Saved"))
                .catch((err) => {
                  console.dir(err);
                  snackbar.addError("Refresh your page!");
                });
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
                  dispatch(deleteBoard({ id: board.id })).then(() =>
                    navigate("/")
                  );
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
