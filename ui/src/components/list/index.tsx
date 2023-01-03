import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { fetchBoards, postBoard } from "../../redux/boardSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

function List() {

  const { boards } = useAppSelector((state) => state.crosswordBoard);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        {boards && boards.map(board => {
          return (
            <Link key={`${board.id}`} to={`/${board.id}`}>
              <Grid item>
                <Paper
                  elevation={3}
                  style={{
                    width: '5em',
                    height: '5em',
                  }}
                >
                  {board.title}
                </Paper>
              </Grid>
            </Link>
          )
        })}
      </Grid>
      <Button
        variant="contained"
        onClick={() => {
          const cells = [];
          for (let i = 0; i < 5; i++) {
            const row = [];
            for (let j = 0; j < 5; j++) {
              row.push({});
            }
            cells.push(row);
          }
          dispatch(postBoard({
            title: 'Test 1234',
            cells,
            id: crypto.randomUUID(),
          }));
        }}
      >
        Create
      </Button>
    </>
  )
}

export default List;