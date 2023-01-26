import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks";
import { postBoard } from "../../redux/boardSlice";
import { useAppDispatch } from "../../redux/hooks";
import { CrosswordBoard } from "../../types";
import { startOfDay } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface DialogProps {
  isOpen: boolean;
  handleClose: () => void;
}

function CreateDialog(props: DialogProps) {
  const { isOpen, handleClose } = props;
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<Date | string>(startOfDay(new Date()));
  const [width, setWidth] = useState<number>(15);
  const [height, setHeight] = useState<number>(15);

  const createBoard = () => {
    if (!user) {
      throw Error("Cannot create a board without a user");
    }
    const cells = [];
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        row.push({});
      }
      cells.push(row);
    }
    dispatch(
      postBoard({
        title,
        cells,
        userId: user.getUsername(),
        crosswordDate: date,
      })
    ).then((response) => {
      const { payload } = response;
      const board = payload as CrosswordBoard;
      navigate(`/${board.id}`);
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Create Puzzle</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Pick the size of the puzzle and then you'll be able to fill the grid
          and set the numbers
        </DialogContentText>
        <Grid
          container
          direction="column"
          alignContent="stretch"
          justifyContent="center"
          spacing={1}
          style={{ width: "15em", margin: "0.1rem" }}
        >
          <Grid item>
            <DatePicker
              label="Crossword Date"
              value={date || new Date()}
              onChange={(newValue: Date | null) => {
                if (newValue) {
                  setDate(startOfDay(newValue).toJSON());
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item>
            <TextField
              variant="filled"
              value={title}
              className="value"
              style={{ width: "100%" }}
              label="title"
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              variant="filled"
              value={width || ""}
              className="value"
              style={{ width: "100%" }}
              label="Width"
              select
              onChange={(event) => {
                const val = event.target.value;
                if (val === "") {
                  setWidth(15);
                } else {
                  setWidth(+event.target.value);
                }
              }}
            >
              {[...Array(50).keys()].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              variant="filled"
              value={height || ""}
              className="value"
              style={{ width: "100%" }}
              label="Height"
              select
              onChange={(event) => {
                const val = event.target.value;
                if (val === "") {
                  setHeight(5);
                } else {
                  setHeight(
                    isNaN(+event.target.value) ? 5 : +event.target.value
                  );
                }
              }}
            >
              {[...Array(50).keys()].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={createBoard}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateDialog;
