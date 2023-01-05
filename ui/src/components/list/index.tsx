import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { fetchBoards, postBoard } from "../../redux/boardSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import CreateDialog from "../createdialog";
import { CrosswordBoard } from "../../types";
import { useAuth } from "../../auth/hooks";

function List() {

  const { boards } = useAppSelector((state) => state.crosswordBoard);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchBoards());
    }
  }, [dispatch, user]);

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
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Create
      </Button>
      <CreateDialog
        isOpen={isOpen}
        handleCreate={(board: CrosswordBoard) => {
          dispatch(postBoard(board));
        }}
        handleClose={() => { setIsOpen(false) }}
      />
    </>
  )
}

export default List;