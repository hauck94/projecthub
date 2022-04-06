import React, { useState } from 'react';
export type LoginOptions = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status: 'ok';
  data: string;
};

export type RegisterOptions = {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
};

export type JWTTokenData = {
  id: number;
  name: string;
  email: string;
  iat: string;
  exp: string;
};

export type AuthContext = {
  token: string | null;
  actions: {
    login: (options: LoginOptions) => Promise<void>;
    register: (options: RegisterOptions) => Promise<void>;
    getTokenData: () => JWTTokenData | null;
    logout: () => void;
    authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  };
};

export const initialAuthContext = {
  actions: {
    getTokenData: () => null,
    login: async () => undefined,
    logout: () => undefined,
    register: async () => undefined,
    authFetch: async () => new Response(),
  },
  token: null,
};

export const authContext = React.createContext<AuthContext>(initialAuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string | null>(window.localStorage.getItem('auth-token'));

  const login = async (values: LoginOptions) => {
    const loginRequest = await fetch('/api/users/login', {
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (loginRequest.status === 200) {
      const { data } = await loginRequest.json();
      setToken(data);
      window.localStorage.setItem('auth-token', data);
    } else {
      throw new Error('user does not exist or the password is wrong');
    }
  };

  const register = async (values: RegisterOptions) => {
    const registerRequest = await fetch('/api/users/', {
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (registerRequest.status === 200) {
      await registerRequest.json();
      await login({ email: values.email, password: values.password });
    } else {
      throw new Error('Error while registering or confirming password');
    }
  };

  const authFetch = async (input: RequestInfo, init?: RequestInit | undefined) => {
    return await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: 'Bearer ' + token,
      },
    });
  };

  const getTokenData = () => {
    if (token) {
      return JSON.parse(atob(token.split('.')[1]));
    }
    return null;
  };

  const logout = () => {
    setToken(null);
    window.localStorage.removeItem('auth-token');
  };
  return (
    <authContext.Provider
      value={{
        actions: {
          getTokenData,
          login,
          logout,
          register,
          authFetch,
        },
        token,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
