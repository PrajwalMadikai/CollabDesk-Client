import { ADMIN_API } from "@/app/api/handle-token-expire";
import { ResponseStatus } from "@/enums/responseStatus";
import getResponseStatus from "@/lib/responseStatus";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useAdminPaymentPlans = () => {
  const [open, setOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<"base" | "premium" | null>(null);
  const [amount, setAmount] = useState("");
  const [folderNum, setFolderNum] = useState("");
  const [workspaceNum, setWorkspaceNum] = useState("");
  const [basePlan, setBasePlan] = useState<any | null>(null);
  const [premiumPlan, setPremiumPlan] = useState<any | null>(null);

  const fetchPaymentPlans = async () => {
    try {
      const response = await ADMIN_API.get("/fetch-plans", { withCredentials: true });
      if (response.status === 200) {
        const plansArray = response.data.data;
        const base = plansArray.find((plan: any) => plan.paymentType === "base");
        const premium = plansArray.find((plan: any) => plan.paymentType === "premium");
        setBasePlan(base);
        setPremiumPlan(premium);
      }
    } catch (error) {
      console.error("Error fetching payment plans:", error);
      toast.error("Failed to fetch payment plans");
    }
  };

  const handleOpen = (type: "base" | "premium") => {
    setPaymentType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPaymentType(null);
    setAmount("");
    setFolderNum("");
    setWorkspaceNum("");
  };

  const handleSave = async () => {
    if (!paymentType || !amount || !folderNum || !workspaceNum) {
      toast.error("Please enter all data");
      return;
    }

    const paymentData = {
      paymentType,
      amount: Number(amount),
      FolderNum: Number(folderNum),
      WorkspaceNum: Number(workspaceNum),
    };

    try {
      const response = await ADMIN_API.post("/payment-plan", paymentData, { withCredentials: true });
      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.CREATED) {
        toast.success("Payment plan created successfully");
        handleClose();
        fetchPaymentPlans();
      }
    } catch (error) {
      console.error("Error creating payment plan:", error);
      toast.error("Failed to create payment plan");
    }
  };

  const handleDelete = async (type: "base" | "premium") => {
    try {
      const response = await ADMIN_API.delete(`/payment-plan/${type}`, { withCredentials: true });
      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} plan deleted successfully`);
        fetchPaymentPlans();
      }
    } catch (error) {
      console.error("Error deleting payment plan:", error);
      toast.error("Failed to delete payment plan");
    }
  };

  useEffect(() => {
    fetchPaymentPlans();
  }, []);

  return {
    open,
    paymentType,
    amount,
    folderNum,
    workspaceNum,
    basePlan,
    premiumPlan,
    handleOpen,
    handleClose,
    handleSave,
    handleDelete,
    setAmount,
    setFolderNum,
    setWorkspaceNum,
  };
};