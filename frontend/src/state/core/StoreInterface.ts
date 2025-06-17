export interface StoreInterface {
  getState: () => unknown;
  dispatch: (action: unknown) => void;
  subscribe: (listener: () => void) => () => void;
}
