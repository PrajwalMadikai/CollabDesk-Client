'use client'
import { motion } from 'framer-motion';
import { ArrowLeft, Home, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
const NotFound=()=> {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  
  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    if (countdown === 0) {
      router.push('/');
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-[180px] md:text-[220px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-none"
              >
                404
              </motion.div>
              
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20"
              >
                <div className="absolute top-0 left-1/4 w-16 h-16 rounded-full bg-blue-500 blur-xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-20 h-20 rounded-full bg-purple-500 blur-xl"></div>
                <div className="absolute top-1/3 right-1/3 w-12 h-12 rounded-full bg-pink-500 blur-xl"></div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Page Not Found</h1>
            <p className="text-gray-300 mb-8 text-lg">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
              >
                <Home size={18} />
                <span>Go Home</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                <span>Go Back</span>
              </motion.button>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-gray-400 flex items-center justify-center lg:justify-start gap-2"
            >
              <RefreshCw size={16} className="animate-spin" />
              <span>Redirecting to home in {countdown} seconds</span>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Bottom decorative elements */}
        <div className="mt-16 grid grid-cols-3 gap-4 opacity-20">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 + (i * 0.2) }}
              className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            ></motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotFound