import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Tesseract from "tesseract.js";
import "./test.css";

function Test() {
  const [progress, setProgress] = useState<number>(0);
  const [text, setText] = useState<string>();

  useEffect(() => {
    Tesseract.recognize(
      `${process.env.PUBLIC_URL}/test.png`,
      //"https://raw.githubusercontent.com/tesseract-ocr/tessdoc/main/images/eurotext.png",
      "eng",
      {
        logger: (m) => {
          const { status, progress } = m;
          console.log(m);
          if (status === "recognizing text") {
            setProgress(progress * 100);
          }
        },
      }
    ).then(({ data }) => {
      const { text } = data;
      setText(text);
      console.log(data);
    });
  }, []);

  return (
    <Box sx={{ width: "70%" }}>
      {text ? (
        <span>{text}</span>
      ) : (
        <LinearProgress variant="determinate" value={progress} />
      )}
    </Box>
  );
}

export default Test;
