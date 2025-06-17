import { configureStore } from '@reduxjs/toolkit';
import sampleSlice from './slices/sampleSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    sample: sampleSlice,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
