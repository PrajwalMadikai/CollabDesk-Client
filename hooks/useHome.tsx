import { API } from "@/app/api/handle-token-expire";
import { paymentPlans } from "@/components/Landing Page/PaymentComponent";
import getResponseStatus from "@/lib/responseStatus";
import { Plan, setPlan } from "@/store/slice/planSlice";
import { clearUser, setUser } from "@/store/slice/userSlice";
import { AppDispatch } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export function useHome() {
  const [basePlan, setBasePlan] = useState<paymentPlans | undefined>();
  const [premiumPlan, setPremiumPlan] = useState<paymentPlans | undefined>();
  const dispatch = useDispatch<AppDispatch>();

  const fetchPaymentPlans = useCallback(async () => {
    try {
      const response = await API.get('/get-plans', { withCredentials: true });
      const responseStatus = getResponseStatus(response.status);
      if (responseStatus === "SUCCESS") {
        const plansArray: Plan[] = response.data.data;
        dispatch(setPlan(plansArray));
        const base = plansArray.find((plan: Plan) => plan.paymentType === "base");
        const premium = plansArray.find((plan: Plan) => plan.paymentType === "premium");
        setBasePlan(base);
        setPremiumPlan(premium);
      }
    } catch (error) {
      console.log("Error during plans fetching", error);
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await API.post('/logout', {}, { withCredentials: true });
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(clearUser());
    } catch (error) {
      console.log("Error during logout", error);
    }
  }, [dispatch]);

  const fetchWorkspaces = useCallback(async (userId: string) => {
    try {
      const response = await API.post("/workspace/fetch", { userId }, { withCredentials: true });
      const responseStatus = getResponseStatus(response.status);
      if (responseStatus === "SUCCESS") {
        return response.data.workspace;  
      }
    } catch (error) {
      console.log("Error during workspace fetching", error);
    }
    return null; 
  }, []);

  useEffect(() => {
    const userFetch = localStorage.getItem('user');
    if (userFetch) {
      const userData = JSON.parse(userFetch);
      if (userData) {
        dispatch(setUser({
          id: userData.id,
          fullname: userData.fullname,
          email: userData.email,
          workSpaces: userData.workSpaces,
          isAuthenticated: true,
          planType: userData.paymentDetail.paymentType,
          avatar: userData.avatar,
        }));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPaymentPlans();
  }, [fetchPaymentPlans]);

  return { basePlan, premiumPlan, logout, fetchWorkspaces };
}