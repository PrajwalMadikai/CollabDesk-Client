'use client';

import Link from 'next/link';

export default function PaymentFailed() {
    return (
        <div className="min-h-screen  bg-[#020817] flex items-center justify-center p-4">
            <div className="w-full   bg-gray-900/50 backdrop-blur-sm shadow-2xl overflow-hidden rounded-lg">
                <div className="flex flex-col md:flex-row">
                    {/* Left Section - Payment Failed Image */}
                    <div className="w-full h-full p-8 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                        <div className="relative w-64 h-64">
                            {/* <Image
                                alt="Payment Failed"
                                layout="fill"
                                objectFit="contain"
                            /> */}
                        </div>
                    </div>

                    {/* Right Section - Payment Failed Message */}
                    <div className="w-full h-full p-8 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-red-500 mb-4">
                            Payment Failed
                        </h2>
                        <p className="text-gray-400 mb-8">
                            There was an error processing your payment. Please try again or contact support if the problem persists.
                        </p>
                        <Link href="/" className="inline-block">
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                                Return to Home
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}