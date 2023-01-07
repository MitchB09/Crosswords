import React from 'react';

import SnackbarContext from './SnackbarContext';

export function useSnackbar() {
  return React.useContext(SnackbarContext);
}

export function useSuccessAlert() {
  return React.useContext(SnackbarContext).addSuccess;
}
