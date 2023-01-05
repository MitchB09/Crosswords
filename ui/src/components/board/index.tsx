import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Cell from "../cell";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { fetchBoard, putBoard, setMode } from "../../redux/boardSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { BoardMode } from "../../types";
import "./board.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAuth } from "../../auth/hooks";

function Board() {
  const { id } = useParams();
  const location = useLocation();

  const { board, mode } = useAppSelector((state) => state.crosswordBoard);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  let [searchParams] = useSearchParams();

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
                {row.map((column, columnIndex) => {
                  return (
                    <Cell
                      key={`${rowIndex}.${columnIndex}`}
                      cell={{ value: column.value, number: column.number }}
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
              dispatch(putBoard({ board, shareCode: shareCode || undefined }));
            }}
          >
            Save
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            style={{ width: "100%" }}
            onClick={() => {
              console.dir(board);
            }}
          >
            Export
          </Button>
        </Grid>
        {user && board && user.getUsername() === board?.userId && (
          <Grid item>
            <Button
              variant="contained"
              style={{ width: "100%" }}
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    `${window.location}?shareCode=${btoa(user?.getUsername())}`
                  )
                  .then(
                    () => {
                      console.log('Copied')
                    },
                    () => {
                      console.log('Failed to copy')
                    }
                  );
              }}
            >
              Share
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
}

export default Board;
