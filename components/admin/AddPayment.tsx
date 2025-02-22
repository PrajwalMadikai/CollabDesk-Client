import { ADMIN_API } from "@/app/api/handle-token-expire";
import { Button, Dialog, TextField } from "@mui/material";
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

  // Function to open the dialog
  const handleOpen = (type: "base" | "premium") => {
    setPaymentType(type);
    setOpen(true);
  };

  // Function to close the dialog
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

  // Fetch payment plans on component mount
  useEffect(() => {
    fetchPaymentPlans();
  }, []);

  // Save payment plan
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
      if (response.status === 201) {
        toast.success("Payment plan created successfully");
        handleClose();
        fetchPaymentPlans(); // Refresh payment plans after creation
      }
    } catch (error) {
      console.error("Error creating payment plan:", error);
      toast.error("Failed to create payment plan");
    }
  };

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      {/* Display Payment Plans */}{/* Buttons to Open Dialog */}
      <div className="flex gap-4 justify-start mb-5">
        <Button
          variant="contained"
          onClick={() => handleOpen("base")}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Add Base Payment
        </Button>
        <Button
          variant="contained"
          onClick={() => handleOpen("premium")}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Add Premium Payment
        </Button>
      </div>

      <div className="flex gap-8 mb-8">
        
        {/* Base Payment Plan */}
        <div className="w-1/2 bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-white mb-4">Base Payment Plan</h2>
          {basePlan ? (
            <div>
              <p className="text-white"><span className="font-semibold">Amount:</span> {basePlan.amount}</p>
              <p className="text-white"><span className="font-semibold">Folders:</span> {basePlan.FolderNum}</p>
              <p className="text-white"><span className="font-semibold">Workspaces:</span> {basePlan.WorkspaceNum}</p>
            </div>
          ) : (
            <p className="text-gray-400">No Base Payment Plan available.</p>
          )}
        </div>

        {/* Premium Payment Plan */}
        <div className="w-1/2 bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-white mb-4">Premium Payment Plan</h2>
          {premiumPlan ? (
            <div>
              <p className="text-white"><span className="font-semibold">Amount:</span> {premiumPlan.amount}</p>
              <p className="text-white"><span className="font-semibold">Folders:</span> {premiumPlan.FolderNum}</p>
              <p className="text-white"><span className="font-semibold">Workspaces:</span> {premiumPlan.WorkspaceNum}</p>
            </div>
          ) : (
            <p className="text-gray-400">No Premium Payment Plan available.</p>
          )}
        </div>
      </div>

      

      {/* Dialog for Adding Payment Plan */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: { backgroundColor: "#1e1e1e", color: "#ffffff" },
        }}
      >
        <div className="text-center py-4 font-bold text-2xl border-b border-gray-700">
          {paymentType?.toUpperCase()} PAYMENT CONFIGURATION
        </div>
        <div className="space-y-8 py-4 px-8">
          {/* Amount Input */}
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: <span className="mr-2">$'</span>,
            }}
            sx={{
              input: { color: "white" },
              label: { color: "gray" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "gray" },
                "&:hover fieldset": { borderColor: "white" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
            }}
          />

          {/* Features Section */}
          <div className="space-y-4">
            <div className="font-semibold text-lg mb-4">Features</div>
            <TextField
              fullWidth
              label="Number of Folders"
              type="number"
              value={folderNum}
              onChange={(e) => setFolderNum(e.target.value)}
              variant="outlined"
              sx={{
                input: { color: "white" },
                label: { color: "gray" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
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
              sx={{
                input: { color: "white" },
                label: { color: "gray" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "gray" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
              }}
            />
          </div>
        </div>
        <div className="flex justify-end p-4 space-x-4 border-t border-gray-700">
          <Button
            onClick={handleClose}
            variant="contained"
            className="bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            className="bg-green-500 hover:bg-green-600"
            disabled={!amount || !folderNum || !workspaceNum}
          >
            Save Payment
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default AddPayment;