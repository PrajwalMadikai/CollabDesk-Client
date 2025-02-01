
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

 

interface UserState {
  id: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: null,
  email: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin(state, action: PayloadAction<{ id: string; email: string; }>) {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
    clearAdmin(state) {
      state.id = null;
      state.email = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAdmin, clearAdmin } = userSlice.actions;
export default userSlice.reducer;
