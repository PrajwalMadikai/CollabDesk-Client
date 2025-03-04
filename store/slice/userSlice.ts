import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Folder {
  id: string;
  name: string;
}

interface Workspace {
  workspaceId: string;
  workspaceName: string;
}

interface UserState {
  id: string | null;
  fullname: string | null;
  email: string | null;
  isAuthenticated: boolean;
  planType:string|null;
  workSpaces: Workspace[];
  
}

const initialState: UserState = {
  id: null,
  fullname: null,
  email: null,
  isAuthenticated: false,
  planType:null,
  workSpaces: [],
 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.fullname = action.payload.fullname;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      state.workSpaces = action.payload.workSpaces;
      state.planType=action.payload.planType
    },
    clearUser(state) {
      state.id = null;
      state.fullname = null;
      state.email = null;
      state.isAuthenticated = false;
      state.planType=null;
      state.workSpaces = [];
      
    },
    updateName(state,action:PayloadAction<string>){
      state.fullname=action.payload
    },
    setPlanType(state,action:PayloadAction<string>){
       state.planType=action.payload
    },
    addWorkspace(state,action:PayloadAction<Workspace>)
    {
      state.workSpaces.push(action.payload)
    },
    removeWorkspace(state, action: PayloadAction<string>) {
      const workspaceId = action.payload;
      state.workSpaces = state.workSpaces.filter(
        (ws) => ws.workspaceId !== workspaceId
      );
    },
    
  },
});

export const { setUser, clearUser,addWorkspace,removeWorkspace,setPlanType ,updateName } = userSlice.actions;

export default userSlice.reducer;