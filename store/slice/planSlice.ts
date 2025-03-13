import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Plan {
    id: string;
    paymentType: string;
    amount: number;
    FolderNum: number;
    WorkspaceNum: number;
  }
interface PlanState {
    plans: Plan[];
  }
  
  const initialState: PlanState = {
    plans: [],
  };

const planSlice=createSlice({
    name:'plan',
    initialState,
    reducers:{
        setPlan(state, action: PayloadAction<Plan[]>) {
            state.plans = action.payload;  
          },
        clearPlan(state){
            state.plans=[]
        }
    }
})
export const {setPlan , clearPlan}=planSlice.actions
export default planSlice.reducer