import Link from "next/link";


export type paymentPlans={
    id:string,
    paymentType:string,
    amount:number,
    FolderNum:number,
    WorkspaceNum:number
}|undefined;


const PaymentComponent=({basePlan,premiumPlan}:{ basePlan:paymentPlans ; premiumPlan: paymentPlans })=>{

 
    
    return(
        <div className="flex flex-col md:flex-row gap-6">
        {/* Base Plan */}
        <div className="animate-fade-right flex-1 bg-gray-900 text-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">
                Base <span className="text-blue-800 font-bold">Plan</span>
            </h3>
            <p className="mb-6 text-gray-400">
                This package offers the basic features you need to get started.
            </p>
            <h4 className="text-3xl font-bold mb-4">
                ₹{basePlan?.amount}
                <span className="text-lg font-medium">/ month</span>
            </h4>
            <Link href={`/payment/${basePlan?.id}`}>
                <button className="w-full py-2 font-semibold bg-transparent border-[1px] border-white rounded-lg text-white hover:bg-blue-800 hover:border-blue-800 transition">
                    Purchase Now
                </button>
            </Link>
            <hr className="my-6 border-gray-700" />
            <ul className="space-y-3 text-gray-400">
                <li>✔️ {basePlan?.FolderNum} folders per month</li>
                <li>✔️ {basePlan?.WorkspaceNum} workspaces per month</li>
                <li>✔️ Text Editor</li>
                <li>✔️ Whiteboard</li>
            </ul>
        </div>

        {/* Premium Plan */}
        <div className=" animate-fade-right flex-1 bg-gray-900 text-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">
                Premium <span className="text-blue-800">Plan</span>
            </h3>
            <p className="mb-6 text-gray-400">
                This package provides full access to all premium features.
            </p>
            <h4 className="text-3xl font-bold mb-4">
                ₹{premiumPlan?.amount}
                <span className="text-lg font-medium">/ month</span>
            </h4>
            <Link href={`/payment/${premiumPlan?.id}`}>
                <button className="w-full py-2 font-semibold bg-transparent border-[1px] border-white rounded-lg text-white hover:bg-blue-800 hover:border-blue-800 transition">
                    Purchase Now
                </button>
            </Link>
            <hr className="my-6 border-gray-700" />
            <ul className="space-y-3 text-gray-400">
                <li>✔️ Unlimited folders per month</li>
                <li>✔️ Unlimited workspaces per month</li>
                <li>✔️ Text Editor</li>
                <li>✔️ Whiteboard</li>
            </ul>
        </div>
    </div>
    )
}

export default PaymentComponent