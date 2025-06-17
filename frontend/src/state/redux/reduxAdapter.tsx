import React from 'react';
import { Provider } from 'react-redux';
import { store } from './configureStore';
import { StateProvider } from '../core/StateContext';

export const ReduxStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <StateProvider store={store}>
    <Provider store={store}>{children}</Provider>
  </StateProvider>
);
