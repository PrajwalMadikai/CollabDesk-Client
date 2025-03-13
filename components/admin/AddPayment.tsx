import { Button, Dialog, TextField } from "@mui/material";
import { Folder, IndianRupee, Layout } from "lucide-react";
import { useAdminPaymentPlans } from "../../hooks/useAdminpayment";
import PlanCard from "./PlanComponent";

const AddPayment = () => {

  const {   
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
  }=useAdminPaymentPlans()

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