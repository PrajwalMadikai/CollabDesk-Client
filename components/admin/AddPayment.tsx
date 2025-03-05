import { ADMIN_API } from "@/app/api/handle-token-expire";
import { ResponseStatus } from "@/enums/responseStatus";
import getResponseStatus from "@/lib/responseStatus";
import { Button, Dialog, TextField } from "@mui/material";
import { Folder, IndianRupee, Layout } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PlanCard from "./PlanComponent";

const AddPayment = () => {
  const [open, setOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<"base" | "premium" | null>(null);
  const [amount, setAmount] = useState("");
  const [folderNum, setFolderNum] = useState("");
  const [workspaceNum, setWorkspaceNum] = useState("");
  const [basePlan, setBasePlan] = useState<any | null>(null);
  const [premiumPlan, setPremiumPlan] = useState<any | null>(null);

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

  useEffect(() => {
    fetchPaymentPlans();
  }, []);

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

  return (
    <div className="bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Payment Plans Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlanCard
          planType="base"
          planData={basePlan}
          onOpen={handleOpen}
          onDelete={handleDelete}
        />

        <PlanCard
          planType="premium"
          planData={premiumPlan}
          onOpen={handleOpen}
          onDelete={handleDelete}
        />
      </div>

      <Dialog open={open} onClose={handleClose}>
        <div className="p-6 bg-gray-800 text-white rounded-lg h-[320px]">
          <h2 className="text-xl font-bold mb-4">
            {paymentType === "base" ? "Base" : "Premium"} Plan Configuration
          </h2>

          {/* Amount Input */}
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: <IndianRupee size={16} />,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.7)",
              },
            }}
            fullWidth
            className="mb-4" 
          />

          {/* Folder Count Input */}
          <TextField
            label="Folder Count"
            value={folderNum}
            onChange={(e) => setFolderNum(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: <Folder size={16} />,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.7)",
              },
            }}
            fullWidth
            className="mb-4" 
          />

          {/* Workspace Count Input */}
          <TextField
            label="Workspace Count"
            value={workspaceNum}
            onChange={(e) => setWorkspaceNum(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: <Layout size={16} />,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.7)",
              },
            }}
            fullWidth
            className="mb-4" 
          />

          {/* Dialog Actions */}
          <div className="flex justify-end gap-4">
            <Button onClick={handleClose} variant="outlined" color="inherit">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save Plan
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AddPayment;