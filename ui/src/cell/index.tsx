import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { CrosswordCell } from "../types";
import "./cell.css";

interface CellProps {
  cell: CrosswordCell
}

function Cell(props: CellProps) {
  const { cell } = props;
  const [value, setValue] = useState<string>(cell.value ? cell.value : '');


  if (cell.value === '-') {
    return (
      <div className="block"></div>
    )
  } else {
    return (
      <div className="cell">
        <div style={{ position: 'relative', width: '0', height: '0' }}><span className="number">{cell.number}</span></div>
        <TextField
          style={{ margin: '0em', padding: '0em' }}
          variant="filled"
          value={value}
          className="value"
          onChange={(event) => {
            setValue(event.target.value.charAt(event.target.value.length - 1).toUpperCase())
          }}
          sx={{
            height: '2em',
            width: '2em',
            color: 'success.main',
            '& .MuiInputBase-input': {
              padding: '0px',
              height: '2em',
              textAlign: 'center',
            },
          }}
        />
      </div>
    )
  }
}

export default Cell;