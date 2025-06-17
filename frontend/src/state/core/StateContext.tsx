import React, { createContext, useContext } from 'react';
import { StoreInterface } from './StoreInterface';

const StateContext = createContext<StoreInterface | null>(null);

export const StateProvider: React.FC<{ store: StoreInterface; children: React.ReactNode }> = ({ store, children }) => (
  <StateContext.Provider value={store}>{children}</StateContext.Provider>
);

export const useAppDispatch = () => {
  const store = useContext(StateContext);
  if (!store) throw new Error('StateProvider is missing');
  return store.dispatch;
};

export const useAppSelector = <T,>(selector: (state: unknown) => T): T => {
  const store = useContext(StateContext);
  if (!store) throw new Error('StateProvider is missing');
  return selector(store.getState());
};
