import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import { fetchBoards } from "../../redux/boardSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";

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
            <Link to={`/${board.id}`}>
              <Grid item>
                <Paper
                  elevation={3}
                  style={{
                    width: '5em',
                    height: '5em',
                  }}
                  variant="outlined"
                >
                  {board.title}
                </Paper>
              </Grid>
            </Link>
          )
        })}
      </Grid>
    </>
  )
}

export default List;