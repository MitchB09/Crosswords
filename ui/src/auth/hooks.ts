import React from 'react';
import { Auth, CognitoUser } from '@aws-amplify/auth';

import {
  ConfirmSignUpInput,
  ForgotPasswordInput,
  ResendSignUpInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
} from './types';
import AuthContext from './context';

export function useAuth() {
  const [user, setUser] = React.useState<CognitoUser | null>(null);

  React.useEffect(() => {
    let active = true;

    const check = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        // const jwt = await (await Auth.currentSession()).getIdToken().getJwtToken();
        setUser(currentUser);
      } catch (error) {
        if (active) setUser(null);
      }
    };

    check();

    return () => {
      active = false;
    };
  }, [setUser]);

  const signIn = React.useCallback(
    async ({ username, password }: SignInInput) => {
      setUser(await Auth.signIn(username, password));
    },
    [setUser],
  );

  const signUp = React.useCallback(
    async ({ username, password }: SignUpInput) => {
      setUser(await (await Auth.signUp(username, password)).user);
    },
    [setUser],
  );

  const signOut = React.useCallback(async () => {
    await Auth.signOut();
    setUser(null);
  }, [setUser]);

  const updateUser = React.useCallback(
    async (attributes: any) => {
      user?.updateAttributes(attributes, (error?: Error) => {
        if (error) throw error;
        setUser(null);
      });
    },
    [user, setUser],
  );

  const deleteUser = React.useCallback(async () => {
    user?.deleteUser((error?: Error) => {
      if (error) throw error;

      setUser(null);
    });
  }, [user, setUser]);

  return { user, signIn, signUp, signOut, updateUser, deleteUser };
}

export function useUser() {
  const { user } = React.useContext(AuthContext);
  if (!user) return null;

  // See https://github.com/aws-amplify/amplify-js/issues/4927
  // @ts-ignore
  return user.attributes;
}

export function useJwtToken() {
  return async function getJwtToken() {
    await (await Auth.currentSession()).getIdToken().getJwtToken();
  };
}

export function useSignIn() {
  return React.useContext(AuthContext).signIn;
}

export function useSignOut() {
  return React.useContext(AuthContext).signOut;
}

export function useUpdateUser() {
  return React.useContext(AuthContext).updateUser;
}

export function useConfirmSignUp() {
  return async function confirmSignUp({ username, code }: ConfirmSignUpInput) {
    await Auth.confirmSignUp(username, code);
  };
}

export function useResendSignUp() {
  return async function resendSignUp({ username }: ResendSignUpInput) {
    await Auth.resendSignUp(username);
  };
}

export function useForgotPassword() {
  return async function forgotPassword({ username }: ForgotPasswordInput) {
    await Auth.forgotPassword(username);
  };
}

export function useResetPassword() {
  return async function resetPassword({ username, code, password }: ResetPasswordInput) {
    await Auth.forgotPasswordSubmit(username, code, password);
  };
}

export function useDeleteUser() {
  return React.useContext(AuthContext).deleteUser;
}
