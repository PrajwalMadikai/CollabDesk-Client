
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Workspace {
  id: string;
  name: string;
}

interface UserState {
  id: string | null;
  fullname: string | null;
  email: string | null;
  isAuthenticated: boolean;
  workSpaces: Workspace[];
}

const initialState: UserState = {
  id: null,
  fullname: null,
  email: null,
  isAuthenticated: false,
  workSpaces:[]
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ id: string; fullname: string; email: string; workSpaces: Workspace[] }>) {
      state.id = action.payload.id;
      state.fullname = action.payload.fullname;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      state.workSpaces = action.payload.workSpaces;  
    },
    clearUser(state) {
      state.id = null;
      state.fullname = null;
      state.email = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
