import React, { useEffect, useState } from 'react';
import { Auth } from '@aws-amplify/auth';
import api from '../api';
import AuthContext from './context';

import { useAuth } from './hooks';

interface AuthProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProps) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const auth = useAuth();
  const { user } = auth;

  useEffect(() => {
    const getAuthHeader = async () => {
      Auth.currentSession()
        .then((session) => {
          const jwt = session.getIdToken().getJwtToken();

          api.interceptors.request.use((config) => {
            if (config.headers) {
              config.headers['Authorization'] = `${jwt}`;
            }
            return config;
          });
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.dir(error);
        })
        .finally(() => {
          setLoaded(true);
        });
    };
    getAuthHeader();
  }, [user]);

  return <AuthContext.Provider value={auth}>{loaded && children}</AuthContext.Provider>;
};

export default AuthProvider;
