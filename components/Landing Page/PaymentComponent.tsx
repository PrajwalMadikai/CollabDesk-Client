import { motion } from "framer-motion";
import { Check, Shield, Star, Zap } from "lucide-react";
import Link from "next/link";

export type paymentPlans = {
  id: string,
  paymentType: string,
  amount: number,
  FolderNum: number,
  WorkspaceNum: number
} | undefined;

const PaymentComponent = ({ basePlan, premiumPlan, userPlan }: { basePlan: paymentPlans; premiumPlan: paymentPlans, userPlan: string | null }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[6px] overflow-hidden shadow-xl border border-gray-700"
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">
              Base <span className="text-blue-400">Plan</span>
            </h3>
          </div>

          <p className="text-gray-400 mb-6">
            Essential features to help you get started with your projects.
          </p>

          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold text-white">₹{basePlan?.amount}</span>
            <span className="text-gray-400 ml-2 text-lg">/month</span>
          </div>
          {userPlan === 'base' ? (
            <button className="w-full py-3 px-4 rounded-lg border border-blue-500 text-blue-400 bg-gray-200 cursor-not-allowed font-medium flex items-center justify-center gap-2">
              <span>Your Current Plan</span>
            </button>
          ) : (
            <Link href={`/payment/${basePlan?.id}`}>
              <button className="w-full py-3 px-4 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 font-medium flex items-center justify-center gap-2 group">
                <span>Get Started</span>
                <Zap className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          )}

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <Check className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">{basePlan?.FolderNum} folders</p>
                <p className="text-gray-500 text-sm">Organize your work efficiently</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <Check className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">{basePlan?.WorkspaceNum} workspaces</p>
                <p className="text-gray-500 text-sm">Collaborate with your team</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <Check className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Text Editor</p>
                <p className="text-gray-500 text-sm">Create and edit documents</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <Check className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Whiteboard</p>
                <p className="text-gray-500 text-sm">Visualize your ideas</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 relative bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[6px] overflow-hidden shadow-2xl border border-indigo-700"
      >


        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold text-white">
              Premium <span className="text-purple-300">Plan</span>
            </h3>
          </div>

          <p className="text-gray-300 mb-6">
            Unlock unlimited potential with our premium features.
          </p>

          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold text-white">₹{premiumPlan?.amount}</span>
            <span className="text-gray-300 ml-2 text-lg">/month</span>
          </div>
          {userPlan == 'premium' ? (
            <button className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-300 font-medium flex items-center justify-center gap-2 group shadow-lg shadow-purple-900/30">
              <span>Your Current Plan</span>
            </button>
          ) : (

            <Link href={`/payment/${premiumPlan?.id}`}>
              <button className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white transition-all duration-300 font-medium flex items-center justify-center gap-2 group shadow-lg shadow-purple-900/30">
                <span>Upgrade Now</span>
                <Zap className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          )}


          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <Check className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-medium">{premiumPlan?.FolderNum} folders</p>
                <p className="text-indigo-200 text-sm">No restrictions on organization</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <Check className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-medium">{premiumPlan?.WorkspaceNum} workspaces</p>
                <p className="text-indigo-200 text-sm">Scale your team without limits</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <Check className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-medium">Advanced Text Editor</p>
                <p className="text-indigo-200 text-sm">With premium formatting options</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <Check className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-medium">Collaborative Whiteboard</p>
                <p className="text-indigo-200 text-sm">Real-time collaboration tools</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <Check className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-medium">Priority Support</p>
                <p className="text-indigo-200 text-sm">Get help when you need it most</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>
      </motion.div>
    </div>
  );
};

export default PaymentComponent;