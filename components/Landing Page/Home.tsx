"use client";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { API } from "../../app/api/handle-token-expire";
import ThemeToggle from '../../components/toggleTheme';
import { ResponseStatus } from "../../enums/responseStatus";
import getResponseStatus from "../../lib/responseStatus";
import { Plan, setPlan } from "../../store/slice/planSlice";
import { clearUser, setUser } from "../../store/slice/userSlice";
import { AppDispatch, RootState } from "../../store/store";
import PaymentComponent, { paymentPlans } from "./PaymentComponent";
 

function HeaderAndLandingHome() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [basePlan, setBasePlan] = useState<paymentPlans>();
  const [premiumPlan, setPremiumPlan] = useState<paymentPlans>();
  const { theme } = useTheme();

  console.log('user redux:', user);

  const fetchPaymentPlans = useCallback(async () => {
    try {
      const response = await API.get('/get-plans', { withCredentials: true });

      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        const plansArray:Plan[]= response.data.data;
        dispatch(setPlan(plansArray));

        const base = plansArray.find((plan:Plan) => plan.paymentType === "base");
        const premium = plansArray.find((plan: Plan) => plan.paymentType === "premium");

        setBasePlan(base);
        setPremiumPlan(premium);
      }
    } catch (error) {
      console.log("Error during plans fetching", error);
    }
  }, [dispatch, setBasePlan, setPremiumPlan]);

  useEffect(() => {
    fetchPaymentPlans();
  }, [fetchPaymentPlans]);  

  useEffect(() => {
    const userFetch = localStorage.getItem('user');

    if (userFetch) {
      const userData = JSON.parse(userFetch);
      if (userData) {
        dispatch(setUser({
          id: userData.id,
          fullname: userData.fullname,
          email: userData.email,
          workSpaces: userData.workSpaces,
          isAuthenticated: true,
          planType: userData.paymentDetail.paymentType,
          avatar: userData.avatar,
        }));
      }
    }
  }, [dispatch]);

  const logout = async () => {
    try {
      await API.post('/logout', { withCredentials: true });

      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      dispatch(clearUser());

      toast.success('Logged out successfully', {
        duration: 2000,
        position: 'top-right',
      });
      router.push('/');
    } catch (error) {
      console.log('error:',error);
      
      toast.error('Error logging out');
    }
  };

  const handleDashboard = async () => {
    if (!user.isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user.workSpaces.length === 0) {
      router.push('/workspace');
      return;
    }

    try {
      const response = await API.post("/workspace/fetch", { userId: user.id }, { withCredentials: true });

      const responseStatus = getResponseStatus(response.status);

      if (responseStatus === ResponseStatus.SUCCESS) {
        if (response.data.workspace.length > 0) {
          router.push(`/dashboard/${response.data.workspace[0].workspaceId}`);
        } else {
          router.push('/workspace');
        }
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      toast.error("Failed to fetch workspaces.");
    }
  };

    return (
      <>
      <div className="relative bg-background text-foreground overflow-x-hidden ">
        {/* Header */}
        <div className="fixed top-0 left-0 w-full h-[60px] flex items-center pb-4 pr-4 z-50 backdrop-blur-md">
          <div className="flex items-center flex-shrink-0">
            <img
            
              src={theme=='dark'?"/collabdesk white logo.png":"/collabdesk Logo.png"}
              alt="CollabDesk Logo"
              className="h-24 w-auto md:h-[125px]"
            />
          </div>
          <div className="flex-grow"></div>
          <div className="flex items-center space-x-3 md:mr-3">
          <ThemeToggle/>
          {user.isAuthenticated ? (
            <> 
              <button onClick={logout} className="text-primary h-[38px] rounded w-12 font-normal text-sm hover:text-gray-300 transition duration-200">
               Logout
              </button>
              <button onClick={handleDashboard} className="bg-primary text-primary-foreground hover:bg-primary/90 h-[32px] rounded w-24  font-light text-sm hover:bg-gray-200 transition duration-200">
                Dashboard
              </button>
            </>
            ) : (
              <>
              <Link href="/login" prefetch={true}>
              <button className="text-primary h-[38px] rounded w-12 font-normal text-sm   transition duration-200">
                 Login
              </button>
              </Link>
              <Link href="/signup" prefetch={true}> 
              <button className="bg-primary text-primary-foreground h-[32px] rounded w-20 font-normal text-sm  transition duration-200">
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
          <div className="text-center h-7 w-[200px] mt-12 text-sm dark:text-white md:h-7 md:w-[250px] border-2 dark:border-white rounded-[14px] mb-4">
            <p className=" tracking-tight">A perfect workspace</p>
          </div>
  
          {/* Big Text under Small Text */}
          <div className="text-center font-extrabold text-3xl  md:text-6xl m-0 p-0 leading-tight tracking-tight">
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-purple-600 dark:from-white dark:to-purple-600">
            The Ultimate Collaboration Hub
          </h2>
          </div>
          <div className="text-center text-xl md:text-4xl font-semibold text-white m-0 p-0 leading-tight tracking-tight">
            <h2 className="text-foreground ">Seamless, Real-Time Teamwork</h2>
          </div>
          <div className="text-center text-sm md:text-md font-extralight font-cursive m-0 p-0">
            <h2 className="text-foreground">Boost efficiency, enhance productivity</h2>
          </div>
          {/* Button under Big Text */}
          <div className="text-center mt-3">
          <button onClick={handleDashboard} className="dark:bg-black  font-medium  hover:text-foreground border   w-[140px] rounded-[8px] text-[16px] text-foreground h-12">
            Get Started
          </button>
          
        </div>

  
          {/* Features boxes */}
        <div className="w-full flex flex-wrap justify-center gap-5 mt-10 px-4 sm:px-6 md:px-0">

          <div className="animate-fade-right w-full sm:w-[48%] md:w-[250px] h-[240px] border-[1px] border-gray-400 rounded-[9px] p-4 flex flex-col items-start shadow-md bg-[rgba(99,102,241,0.1)]">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mr-2" viewBox="0 0 640 512">
                <path fill="#63e" d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z" />
              </svg>
            </div>
            <h3 className="text-xl md:text-lg font-semibold mb-2 mt-4 text-foreground">Meeting Room</h3>
            <p className="text-[18px] md:text-[14px] font-light dark:text-gray-200">Real-time meeting room with a shared whiteboard.</p>
          </div>

          {/* Feature Box 2 */}
          <div className="animate-fade-right w-full sm:w-[48%] md:w-[250px] h-[240px] border-[1px] border-gray-400 rounded-[9px] p-4 flex flex-col items-start shadow-md bg-[rgba(99,102,241,0.1)]">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mr-2" viewBox="0 0 512 512">
                <path fill="#63e" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/>
              </svg>
            </div>
            <h3 className="text-xl md:text-lg font-semibold mb-2 mt-4 text-foreground">Publish your doc online</h3>
            <p className="text-[18px] md:text-[14px] font-light dark:text-gray-200">Publish your work online with ease.</p>
          </div>

          {/* Feature Box 3 */}
          <div className="animate-fade-right w-full sm:w-[48%] md:w-[250px] h-[240px] border-[1px] border-gray-400 rounded-[9px] p-4 flex flex-col items-start shadow-md bg-[rgba(99,102,241,0.1)]">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mr-2" viewBox="0 0 640 512">
                <path fill="#63e" d="M528 64H272a16 16 0 0 0-16 16v352a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zM168 64H112a16 16 0 0 0-16 16v48H16a16 16 0 0 0-16 16v256a16 16 0 0 0 16 16h80v48a16 16 0 0 0 16 16h56a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm424 64h-88v128h88z"/>
              </svg>
            </div>
            <h3 className="text-xl md:text-lg font-semibold mb-2 mt-4 text-foreground">Collaborative Editing</h3>
            <p className="text-[18px] md:text-[14px] font-light dark:text-gray-200">Work collaboratively with your team in real time.</p>
          </div>

          {/* Feature Box 4 */}
          <div className="animate-fade-right w-full sm:w-[48%] md:w-[250px] h-[240px] border-[1px] border-gray-400 rounded-[9px] p-4 flex flex-col items-start shadow-md bg-[rgba(99,102,241,0.1)]">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mr-2" viewBox="0 0 640 512">
                <path fill="#63e" d="M320 0C213.1 0 128 85.1 128 192s85.1 192 192 192 192-85.1 192-192S426.9 0 320 0zM64 512H576c35.3 0 64-28.7 64-64H0C0 483.3 28.7 512 64 512z"/>
              </svg>
            </div>
            <h3 className="text-xl md:text-lg font-semibold mb-2 mt-4 text-foreground">Monthly Subscription</h3>
            <p className="text-[18px] md:text-[14px] font-light dark:text-gray-200">Ensure data privacy with secure access controls.</p>
          </div>
          
        </div>
        </div>
 

      <div className="w-full h-auto  py-10 flex justify-center items-center">
    <div className="w-[1100px] flex flex-col gap-6">
      <h2 className="animate-fade-down text-foreground text-3xl font-semibold text-center mb-6">
        Subscription <span className="text-blue-800 font-extrabold">Details</span>
      </h2>
       <PaymentComponent basePlan={basePlan} premiumPlan={premiumPlan} />

        <div className="bg-[#272757] text-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">Professional</h3>
            <p className="mb-6 text-gray-300">
              Designed for greater flexibility, this solution offers advanced tools for custom tailoring to your needs.
            </p>
            <button 
            className="dark:bg-black font-medium hover:text-foreground border w-[140px] rounded-[8px] text-[16px] text-foreground h-12"
          >
            Get Started
          </button>
        </div>
       </div>
     </div>
   </div> 
   </>
)};
  
  export default HeaderAndLandingHome;
  