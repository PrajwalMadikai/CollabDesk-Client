import { API } from "@/app/api/handle-token-expire";
import { paymentPlans } from "@/components/Landing Page/PaymentComponent";
import getResponseStatus from "@/lib/responseStatus";
import { userData } from "@/services/AuthApi";
import { Plan, setPlan } from "@/store/slice/planSlice";
import { clearUser, setUser } from "@/store/slice/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useHome() {
    const [basePlan, setBasePlan] = useState<paymentPlans | undefined>();
    const [premiumPlan, setPremiumPlan] = useState<paymentPlans | undefined>();
    const [userPlan, setUserPlan] = useState<string | null>(null)
    const user = useSelector((state: RootState) => state.user)
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

        const UserPaymentPlan = async () => {
            if (!user.id) {
                console.log('no user id');
                
                return
             }
            try {
                const response = await userData(user.id)
                console.log('res:', response.data);

                setUserPlan(response.data.paymentDetail.paymentType)
            } catch (error) {
                console.log('Error in fetching user data');

            }
        }
        UserPaymentPlan()
    }, [])

    useEffect(() => {
        fetchPaymentPlans();
    }, [fetchPaymentPlans]);


    return { basePlan, premiumPlan, logout, fetchWorkspaces, userPlan };
}