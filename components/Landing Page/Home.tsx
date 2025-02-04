"use client";

import { API } from "@/api/handle-token-expire";
import { clearUser, setUser } from "@/store/slice/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

function HeaderAndLandingHome() {

  const router=useRouter()
  const user=useSelector((state:RootState)=>state.user)
  const dispath=useDispatch<AppDispatch>()
  
  useEffect(() => {
    const userFetch = localStorage.getItem('user');
    
    if (userFetch) {
      const userData = JSON.parse(userFetch);
      if (userData) {
        dispath(setUser({
          id: userData.id,
          fullname: userData.fullname,
          email: userData.email,
          workSpaces: userData.workSpaces,
          isAuthenticated: true,
        }));
      }
    }
  }, [dispath]);
  

  const logout=async()=>{

    try {
    
      await API.post('/logout', { withCredentials: true })
    
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      
       dispath(clearUser())

       toast.success('Logged out successfully');
       router.push('/');  
     } catch (error) {
       toast.error('Error logging out');
     }
  }
  
console.log('user home:',user);

  const handleDashboard=()=>{

    if (!user.isAuthenticated) {
      router.push('/login');
      return;
    }
    
        if(user.workSpaces.length==0)
        {
          router.push('/workspace')
        }else{
          router.push('/dashboard')
        }
  }

    return (
      <>
      <div className="relative overflow-x-hidden bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
        {/* Header */}
        <div className="fixed top-0 left-0 w-full h-[60px] flex items-center pb-4 pr-4 z-50 backdrop-blur-md">
          <div className="flex items-center flex-shrink-0">
            <img
              src="/collabdesk white logo.png"
              alt="CollabDesk Logo"
              className="h-24 w-auto md:h-[125px]"
            />
          </div>
          <div className="flex-grow"></div>
          <div className="flex items-center space-x-3 md:mr-3">
          {user.isAuthenticated ? (
            <> 
              <Link href="/logout">
              <button onClick={logout} className="text-white  h-[38px] rounded w-12 font-extralight text-sm hover:text-gray-300 transition duration-200">
               Logout
              </button>
              </Link>
              <Link href="/dashboard" prefetch={true}>
              <button className="bg-white text-black h-[32px] rounded w-24  font-extralight text-sm hover:bg-gray-200 transition duration-200">
                Dashboard
              </button>
              </Link>
            </>
            ) : (
              <>
              <Link href="/login" prefetch={true}>
              <button className="text-white h-[38px] rounded w-12 font-extralight text-sm hover:text-gray-300 transition duration-200">
                 Login
              </button>
              </Link>
              <Link href="/signup" prefetch={true}> 
              <button className="bg-white text-black h-[32px] rounded w-20 font-extralight text-sm hover:bg-gray-200 transition duration-200">
                Signup
              </button>
              </Link>
          </>
           )}
          </div>
        </div>
  
        {/* Home Content */}
        <div className="w-full flex flex-col items-center justify-center pt-[60px] min-h-screen">
          {/* Small Text under Logo */}
          <div className="text-center h-7 mt-12 text-sm text-white md:h-7 md:w-[250px] border-2 border-white rounded-[14px] mb-4">
            <p className="p-1 tracking-tight">A perfect workspace</p>
          </div>
  
          {/* Big Text under Small Text */}
          <div className="text-center font-extrabold text-3xl md:text-6xl text-white m-0 p-0 leading-tight tracking-tight">
            <h2>All-in-One Platform</h2>
          </div>
          <div className="text-center text-xl md:text-4xl font-semibold text-white m-0 p-0 leading-tight tracking-tight">
            <h2>for real-time collaboration</h2>
          </div>
          <div className="text-center text-sm md:text-md font-extralight font-cursive  m-0 p-0">
            <h2>and enhanced productivity</h2>
          </div>
  
          {/* Button under Big Text */}
          <div className="text-center mt-5">
          <button onClick={handleDashboard} className="bg-transparent hover:bg-blue-600 hover:border-0 border border-gray w-[160px] rounded-[5px] text-[16px] text-white h-10">
            Get Started
          </button>
          
        </div>

  
          {/* Features boxes */}
        <div className="w-full flex flex-wrap justify-center gap-5 mt-10 px-4 sm:px-6 md:px-0">
          {/* Feature Box 1 */}
          <div className="animate-fade-right w-full sm:w-[48%] md:w-[250px] h-[240px] border-[1px] border-gray-400 rounded-[9px] p-4 flex flex-col items-start shadow-md bg-[rgba(99,102,241,0.1)]">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mr-2" viewBox="0 0 640 512">
                <path fill="#63e" d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z" />
              </svg>
            </div>
            <h3 className="text-xl md:text-lg font-semibold mb-2 mt-4 text-white">Meeting Room</h3>
            <p className="text-[18px] md:text-[14px] font-light text-gray-200">Real-time meeting room with a shared whiteboard.</p>
          </div>

          {/* Feature Box 2 */}
          <div className="animate-fade-right w-full sm:w-[48%] md:w-[250px] h-[240px] border-[1px] border-gray-400 rounded-[9px] p-4 flex flex-col items-start shadow-md bg-[rgba(99,102,241,0.1)]">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mr-2" viewBox="0 0 512 512">
                <path fill="#63e" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/>
              </svg>
            </div>
            <h3 className="text-xl md:text-lg font-semibold mb-2 mt-4 text-white">Publish your doc online</h3>
            <p className="text-[18px] md:text-[14px] font-light text-gray-200">Publish your work online with ease.</p>
          </div>

          {/* Feature Box 3 */}
          <div className="animate-fade-right w-full sm:w-[48%] md:w-[250px] h-[240px] border-[1px] border-gray-400 rounded-[9px] p-4 flex flex-col items-start shadow-md bg-[rgba(99,102,241,0.1)]">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mr-2" viewBox="0 0 640 512">
                <path fill="#63e" d="M528 64H272a16 16 0 0 0-16 16v352a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zM168 64H112a16 16 0 0 0-16 16v48H16a16 16 0 0 0-16 16v256a16 16 0 0 0 16 16h80v48a16 16 0 0 0 16 16h56a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm424 64h-88v128h88z"/>
              </svg>
            </div>
            <h3 className="text-xl md:text-lg font-semibold mb-2 mt-4 text-white">Collaborative Editing</h3>
            <p className="text-[18px] md:text-[14px] font-light text-gray-200">Work collaboratively with your team in real time.</p>
          </div>

          {/* Feature Box 4 */}
          <div className="animate-fade-right w-full sm:w-[48%] md:w-[250px] h-[240px] border-[1px] border-gray-400 rounded-[9px] p-4 flex flex-col items-start shadow-md bg-[rgba(99,102,241,0.1)]">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mr-2" viewBox="0 0 640 512">
                <path fill="#63e" d="M320 0C213.1 0 128 85.1 128 192s85.1 192 192 192 192-85.1 192-192S426.9 0 320 0zM64 512H576c35.3 0 64-28.7 64-64H0C0 483.3 28.7 512 64 512z"/>
              </svg>
            </div>
            <h3 className="text-xl md:text-lg font-semibold mb-2 mt-4 text-white">AI Auto-completion</h3>
            <p className="text-[18px] md:text-[14px] font-light text-gray-200">Ensure data privacy with secure access controls.</p>
          </div>
        </div>

 
        </div>
 

      <div className="w-full h-auto  py-10 flex justify-center items-center">
  <div className="w-[1100px] flex flex-col gap-6">
    <h2 className="animate-fade-down text-white text-3xl font-semibold text-center mb-6">
      Subscription <span className="text-blue-800 font-extrabold">Details</span>
    </h2>

    {/* Subscription Options */}
    <div className="flex flex-col md:flex-row gap-6">
      {/* Starter Plan */}
      <div className="flex-1 bg-gray-900 text-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Starter</h3>
        <p className="mb-6 text-gray-400">
          This package offers the basic features you need to get started.
        </p>
        <h4 className="text-3xl font-bold mb-4">$39 <span className="text-lg font-medium">/ month</span></h4>
        <button className="w-full py-2 bg-transparent border-[1px] border-white rounded-lg text-white hover:bg-blue-800 hover:border-blue-800 transition">
          Get Started
        </button>
        <hr className="my-6 border-gray-700" />
        <ul className="space-y-3 text-gray-400">
          <li>✔️ Production up to 10,000 units per month</li>
          <li>✔️ 24/7 technical support</li>
          <li>✔️ Access the production dashboard</li>
          <li>✔️ Initial setup guide</li>
        </ul>
      </div>

      {/* Enterprise Plan */}
      <div className="flex-1 bg-gray-900 text-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
        <p className="mb-6 text-gray-400">
          This package provides full access to all premium features.
        </p>
        <h4 className="text-3xl font-bold mb-4">$99 <span className="text-lg font-medium">/ month</span></h4>
        <button className="w-full py-2 bg-transparent border-[1px] border-white rounded-lg text-white hover:bg-blue-800 hover:border-blue-800 transition">
          Get Started
        </button>
        <hr className="my-6 border-gray-700" />
        <ul className="space-y-3 text-gray-400">
          <li>✔️ Unlimited production units</li>
          <li>✔️ Dedicated account manager</li>
          <li>✔️ Tailored manufacturing solutions</li>
          <li>✔️ Predictive production optimization</li>
        </ul>
      </div>
    </div>

    {/* Professional Plan */}
    <div className="bg-[#272757] text-white p-6 rounded-lg shadow-md text-center">
      <h3 className="text-xl font-semibold mb-4">Professional</h3>
      <p className="mb-6 text-gray-300">
        Designed for greater flexibility, this solution offers advanced tools for custom tailoring to your needs.
      </p>
      <button className="py-2 px-6 bg-blue-800 rounded-lg text-white hover:bg-blue-600 transition">
        Get Started
      </button>
    </div>
    </div>
    </div>
    </div>



      </>
    );
  }
  
  export default HeaderAndLandingHome;
  