import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Cell from "../cell";
import { useParams } from 'react-router-dom';
import { fetchBoard, setMode } from "../../redux/boardSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { BoardMode } from "../../types";
import "./board.css";
import Button from "@mui/material/Button";

function Board() {
  const { id } = useParams();

  const { board, mode } = useAppSelector((state) => state.crosswordBoard);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchBoard(id));
    }
  }, [id, dispatch]);

  return (
    <>
      <Grid container direction='column' alignContent='center' justifyContent='center' >
        {board && board.cells.map((row, rowIndex) => {
          return (
            <Grid key={`${rowIndex}`} item container direction='row' alignContent='center' justifyContent='center' >
              {row.map((column, columnIndex) => {
                return (
                  <Cell
                    key={`${rowIndex}.${columnIndex}`}
                    cell={{ value: column.value, number: column.number }}
                    mode={mode}
                    row={rowIndex}
                    column={columnIndex}
                  />
                )
              })}
            </Grid>
          )
        })}
      </Grid>
      <Grid
        container
        direction='column'
        alignContent='stretch'
        justifyContent='center'
        spacing={1}
        style={{ width: '15em', margin: '0.1rem' }}
      >
        {mode === BoardMode.CONSTRUCTION &&
          <Grid item>
            <Button
              variant="contained"
              style={{ width: '100%' }}
              onClick={() => {
                dispatch(setMode(BoardMode.FILLING));
              }}
            >
              Fill
            </Button>
          </Grid>
        }
        {mode === BoardMode.FILLING &&
          <Grid item>

            <Button
              variant="contained"
              style={{ width: '100%' }}
              onClick={() => {
                dispatch(setMode(BoardMode.CONSTRUCTION));
              }}
            >
              Construction
            </Button>
          </Grid>
        }
        <Grid item>

          <Button
            variant="contained"
            style={{ width: '100%' }}
            onClick={() => {
              console.dir(board);
            }}
          >
            Export
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default Board;