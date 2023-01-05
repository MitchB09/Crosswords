import React from 'react';
import { CognitoUser } from '@aws-amplify/auth';

import { ProfileAttributes, SignInInput } from './types';

interface AuthState {
  user: CognitoUser | null;
  signIn(input: SignInInput): Promise<void>;
  signOut(): Promise<void>;
  updateUser(input: ProfileAttributes): Promise<void>;
  deleteUser(): Promise<void>;
}

const AuthContext = React.createContext<AuthState>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  updateUser: async () => {},
  deleteUser: async () => {},
});

export default AuthContext;
