import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { clearTokens, setTokens, userFromAccessToken } from './tokenManager';
import type { AuthTokens, AuthUser, LoginResponseData } from '../types';

interface AuthState {
  user: AuthUser | null;
  status: 'guest' | 'authenticated';
}

const initialState: AuthState = {
  user: null,
  status: 'guest',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<LoginResponseData>) => {
      const { user, accessToken, refreshToken } = action.payload;
      setTokens({ accessToken, refreshToken });
      state.user = user;
      state.status = 'authenticated';
    },
    applyRefreshedTokens: (state, action: PayloadAction<AuthTokens>) => {
      setTokens(action.payload);
      state.user = userFromAccessToken(action.payload.accessToken, state.user) ?? state.user;
      state.status = 'authenticated';
    },
    clearSession: (state) => {
      clearTokens();
      state.user = null;
      state.status = 'guest';
    },
  },
});

export const { setSession, applyRefreshedTokens, clearSession } = authSlice.actions;
export default authSlice.reducer;
