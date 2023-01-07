import React, { useEffect, useState } from "react";
import { Alert, AlertColor, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SnackbarContext from "./SnackbarContext";

interface SnackbarProps {
  children: React.ReactNode;
}

interface SnackbarMessage {
  id: number;
  open: boolean;
  message: string;
  severity: AlertColor;
}

const SnackbarProvider = ({ children }: SnackbarProps) => {
  const [snackbarMessages, setSnackbarMessages] = useState<SnackbarMessage[]>(
    []
  );
  const activeAlertIds = snackbarMessages.join(",");

  useEffect(() => {
    if (activeAlertIds.length > 0) {
      const timer = setTimeout(
        () =>
          setSnackbarMessages((_snackbarMessages) =>
            _snackbarMessages.slice(0, _snackbarMessages.length - 1)
          ),
        5000
      );
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [activeAlertIds]);

  const removeMessage = (id: number) => {
    setSnackbarMessages((_snackbarMessages) =>
      _snackbarMessages.filter((message) => message.id !== id)
    );
  };

  const addSnackbarMessage = (content: SnackbarMessage): void => {
    setSnackbarMessages((_snackbarMessages) => [content, ..._snackbarMessages]);
  };

  const addMessage = (_message: string, severity: AlertColor): void => {
    const randId = Math.floor(Math.random() * (1000 - 1) + 1);
    addSnackbarMessage({ id: randId, message: _message, severity, open: true });
  };

  const addSuccess = (_message: string): void => {
    addMessage(_message, "success");
  };

  const addError = (_message: string): void => {
    addMessage(_message, "error");
  };

  return (
    <SnackbarContext.Provider
      value={{
        addMessage,
        addSuccess,
        addError,
      }}
    >
      {children}
      {snackbarMessages.map((snackbarMessage) => (
        <Snackbar
          key={snackbarMessage.id}
          open={snackbarMessage.open}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          autoHideDuration={2500}
        >
          <Alert
            severity={snackbarMessage.severity}
            variant="filled"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => removeMessage(snackbarMessage.id)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {snackbarMessage.message}
          </Alert>
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
