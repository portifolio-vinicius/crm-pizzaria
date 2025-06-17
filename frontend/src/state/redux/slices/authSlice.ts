import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  role: string | null;
}

function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

const initialToken = sessionStorage.getItem('token');
const initialRole = initialToken
  ? (parseJwt(initialToken).role as string | undefined)?.replace('ROLE_', '') || null
  : null;

const initialState: AuthState = {
  token: initialToken,
  role: initialRole,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (action.payload) {
        sessionStorage.setItem('token', action.payload);
        const payload = parseJwt(action.payload);
        state.role = payload.role ? String(payload.role).replace('ROLE_', '') : null;
      } else {
        sessionStorage.removeItem('token');
        state.role = null;
      }
    },
    clearToken(state) {
      state.token = null;
      state.role = null;
      sessionStorage.removeItem('token');
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
