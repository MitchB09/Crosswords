import React, { ReactNode, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Cell from "../cell";
import { fetchBoard } from "../redux/boardSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { CrosswordBoard, CrosswordCell } from "../types";
import "./board.css";

interface BoardProps {
  id: number;
}

function Board(props: BoardProps) {
  const { id } = props;

  const { board } = useAppSelector((state) => state.crosswordBoard);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBoard(id));
  }, []);

  useEffect(() => {
    console.dir(board);
  }, [board]);

  return (
    <>
      <Grid container direction='column' alignContent='center' justifyContent='center' >
        {board && board.cells.map(row => {
          return (
            <Grid item container direction='row' alignContent='center' justifyContent='center' >
              {row.map(column => {
                return (
                  <Cell cell={{ value: column.value, number: column.number }} />
                )
              })}
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}

export default Board;