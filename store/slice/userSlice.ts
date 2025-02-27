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
  workspaceCount:number;
  folders: Folder[]; 
  folderCount: number;  
}

const initialState: UserState = {
  id: null,
  fullname: null,
  email: null,
  isAuthenticated: false,
  planType:null,
  workSpaces: [],
  workspaceCount:0,
  folders: [], 
  folderCount: 0,  
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
    },
    clearUser(state) {
      state.id = null;
      state.fullname = null;
      state.email = null;
      state.isAuthenticated = false;
      state.planType=null;
      state.workSpaces = [];
      state.workspaceCount=0;
      state.folders = []; 
      state.folderCount = 0; 
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
      state.workspaceCount+=1;
    },
    removeWorkspace(state, action: PayloadAction<string>) {
      const wsIndex = state.workSpaces.findIndex(
        (ws) => ws.workspaceId === action.payload
      );
      if (wsIndex !== -1) {
        state.folders.splice(wsIndex, 1);  
        state.folderCount -= 1;  
      }
    },
      
    addFolder(state, action: PayloadAction<Folder>) {
      state.folders.push(action.payload); 
      state.folderCount += 1;  
    },
    // Remove a folder by ID
    removeFolder(state, action: PayloadAction<string>) {
      const folderIndex = state.folders.findIndex(
        (folder) => folder.id === action.payload
      );
      if (folderIndex !== -1) {
        state.folders.splice(folderIndex, 1);  
        state.folderCount -= 1;  
      }
    },
    
  },
});

export const { setUser, clearUser, addFolder, removeFolder,addWorkspace,removeWorkspace,setPlanType ,updateName } = userSlice.actions;

export default userSlice.reducer;