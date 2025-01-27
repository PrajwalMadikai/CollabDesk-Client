// store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string;
  email: string;
  avatar: string;
  _id: string;
}

const initialState: UserState = {
  name: '',
  email: '',
  avatar: '',
  _id: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state._id = action.payload._id;
    },
    clearUser: (state) => {
      state.name = '';
      state.email = '';
      state.avatar = '';
      state._id = '';
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
