import React from 'react';

interface SnackbarState {
  addMessage(message: string, severity: string): void;
  addSuccess(message: string): void;
  addError(message: string): void;
}

const SnackbarContext = React.createContext<SnackbarState>({
  addMessage: () => {},
  addSuccess: () => {},
  addError: () => {},
});

export default SnackbarContext;
