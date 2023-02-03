import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { fetchBoards } from "../../redux/boardSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import CreateDialog from "../createdialog";
import { useAuth } from "../../auth/hooks";
import format from "date-fns/format";

function List() {
  const { boards } = useAppSelector((state) => state.crosswordBoard);
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user && boards === undefined) {
      dispatch(fetchBoards());
    }
  }, [dispatch, user, boards]);

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={4}
        style={{ margin: "1em", maxWidth: "800px" }}
      >
        {boards &&
          boards.map((board) => {
            return (
              <Link key={`${board.id}`} to={`/${board.id}`}>
                <Grid item style={{ padding: "0.25em", margin: "0.25em" }}>
                  <Paper
                    elevation={3}
                    style={{
                      width: "6em",
                      height: "6em",
                      padding: "0.25em",
                    }}
                  >
                    {board.crosswordDate
                      ? format(
                          new Date(board?.crosswordDate),
                          "EEEE, MMMM do yyyy"
                        )
                      : board.title}
                  </Paper>
                </Grid>
              </Link>
            );
          })}
      </Grid>
      <Button
        variant="contained"
        style={{ margin: "1em" }}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Create
      </Button>
      <CreateDialog
        isOpen={isOpen}
        handleClose={() => {
          setIsOpen(false);
        }}
      />
    </>
  );
}

export default List;
