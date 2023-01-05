import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { CrosswordBoard } from "../../types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../../auth/hooks";

interface DialogProps {
  isOpen: boolean;
  handleCreate: (board: CrosswordBoard) => void;
  handleClose: () => void;
}

function CreateDialog(props: DialogProps) {
  const { isOpen, handleCreate, handleClose } = props;
  const { user } = useAuth();

  const [title, setTitle] = useState<string>('');
  const [width, setWidth] = useState<number>(15);
  const [height, setHeight] = useState<number>(15);

  const createBoard = () => {
    if (!user) {
      throw Error("Cannot create a board without a user")
    }
    const cells = [];
    for (let i = 0; i < width; i++) {
      const row = [];
      for (let j = 0; j < height; j++) {
        row.push({});
      }
      cells.push(row);
    }
    handleCreate({
      title,
      cells,
      id: crypto.randomUUID(),
      userId: user.getUsername(),
    })
    handleClose();
  }


  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <Grid
          container
          direction='column'
          alignContent='stretch'
          justifyContent='center'
          spacing={1}
          style={{ width: '15em', margin: '0.1rem' }}
        >
          <Grid item>
            <TextField
              variant="filled"
              value={title}
              className="value"
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            /> 
          </Grid>
          <Grid item>
            <TextField
              variant="filled"
              value={width || ''}
              className="value"
              select
              onChange={(event) => {
                const val = event.target.value;
                if (val === '') {
                  setWidth(15)
                } else {
                  setWidth(+event.target.value)
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
              value={height || ''}
              className="value"
              select
              onChange={(event) => {
                const val = event.target.value;
                if (val === '') {
                  setHeight(5)
                } else {
                  setHeight(isNaN(+event.target.value) ? 5 : +event.target.value)
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
  )
}

export default CreateDialog;