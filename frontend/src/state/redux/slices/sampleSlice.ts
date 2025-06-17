import { createSlice } from '@reduxjs/toolkit';

interface SampleState {
  value: number;
}

const initialState: SampleState = {
  value: 0,
};

const sampleSlice = createSlice({
  name: 'sample',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1;
    },
  },
});

export const { increment } = sampleSlice.actions;
export default sampleSlice.reducer;
