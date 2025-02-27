import { ADMIN_API } from "@/app/api/handle-token-expire";
import { ResponseStatus } from "@/enums/responseStatus";
import getResponseStatus from "@/lib/responseStatus";
import { Button, Dialog, TextField } from "@mui/material";
import { DollarSign, Folder, Layout, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddPayment = () => {
  const [open, setOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<"base" | "premium" | null>(null);
  const [amount, setAmount] = useState("");
  const [folderNum, setFolderNum] = useState("");
  const [workspaceNum, setWorkspaceNum] = useState("");
  const [basePlan, setBasePlan] = useState<{ amount: number; FolderNum: number; WorkspaceNum: number } | null>(null);
  const [premiumPlan, setPremiumPlan] = useState<{ amount: number; FolderNum: number; WorkspaceNum: number } | null>(null);

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

      const responseStatus=getResponseStatus(response.status)

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

      const responseStatus=getResponseStatus(response.status)

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
    <div className="p-8 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Payment Plans Management</h1>

      {/* Payment Plans Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Base Plan Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 relative">
            <div className="absolute top-6 right-6 flex space-x-2">
              {!basePlan && (
                <Button
                  variant="contained"
                  onClick={() => handleOpen("base")}
                  className="bg-blue-500 hover:bg-blue-600 min-w-0 px-3 py-1"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
              {basePlan && (
                <Button
                  variant="contained"
                  onClick={() => handleDelete("base")}
                  className="bg-red-500 hover:bg-red-600 min-w-0 px-3 py-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">Base Plan</h2>
            {basePlan ? (
              <div className="space-y-4">
                <div className="flex items-center text-3xl font-bold text-blue-400">
                  <DollarSign className="w-8 h-8 mr-1" />
                  {basePlan.amount}
                  <span className="text-lg text-gray-400 ml-2">/month</span>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="flex items-center text-gray-300">
                    <Folder className="w-5 h-5 mr-3 text-blue-400" />
                    <span>{basePlan.FolderNum} Folders</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Layout className="w-5 h-5 mr-3 text-blue-400" />
                    <span>{basePlan.WorkspaceNum} Workspaces</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No Base Plan configured</p>
            )}
          </div>
        </div>

        {/* Premium Plan Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 relative">
            <div className="absolute top-6 right-6 flex space-x-2">
              {!premiumPlan && (
                <Button
                  variant="contained"
                  onClick={() => handleOpen("premium")}
                  className="bg-purple-500 hover:bg-purple-600 min-w-0 px-3 py-1"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
              {premiumPlan && (
                <Button
                  variant="contained"
                  onClick={() => handleDelete("premium")}
                  className="bg-red-500 hover:bg-red-600 min-w-0 px-3 py-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">Premium Plan</h2>
            {premiumPlan ? (
              <div className="space-y-4">
                <div className="flex items-center text-3xl font-bold text-purple-400">
                  <DollarSign className="w-8 h-8 mr-1" />
                  {premiumPlan.amount}
                  <span className="text-lg text-gray-400 ml-2">/month</span>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="flex items-center text-gray-300">
                    <Folder className="w-5 h-5 mr-3 text-purple-400" />
                    <span>{premiumPlan.FolderNum} Folders</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Layout className="w-5 h-5 mr-3 text-purple-400" />
                    <span>{premiumPlan.WorkspaceNum} Workspaces</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No Premium Plan configured</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Payment Plan Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: { 
            backgroundColor: "#1a1a1a",
            backgroundImage: "linear-gradient(to bottom right, rgba(31,41,55,0.5), rgba(17,24,39,0.5))",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      >
        <div className="text-center py-6 px-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {paymentType === 'base' ? 'Base' : 'Premium'} Plan Configuration
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: <DollarSign className="w-5 h-5 text-gray-400 mr-2" />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255,255,255,0.7)',
              },
            }}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
            <TextField
              fullWidth
              label="Number of Folders"
              type="number"
              value={folderNum}
              onChange={(e) => setFolderNum(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: <Folder className="w-5 h-5 text-gray-400 mr-2" />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                },
              }}
            />
            <TextField
              fullWidth
              label="Number of Workspaces"
              type="number"
              value={workspaceNum}
              onChange={(e) => setWorkspaceNum(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: <Layout className="w-5 h-5 text-gray-400 mr-2" />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                },
              }}
            />
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-700 gap-3">
          <Button
            onClick={handleClose}
            variant="outlined"
            className="text-gray-300 border-gray-600 hover:border-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!amount || !folderNum || !workspaceNum}
          >
            Save Plan
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default AddPayment;