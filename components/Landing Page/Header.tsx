
function Header() {


    


    return (
        <div className="fixed top-1 left-0 w-full h-[60px] flex items-center pb-4 pr-4 bg-transparent z-50 ">
        <div className="flex items-center flex-shrink-0">
          <img
            src="/collabdesk white logo.png"
            alt="CollabDesk Logo"
            className="h-24 w-auto md:h-[125px] "
          />
        </div>
        <div className="flex-grow"></div>
        <div className="flex items-center space-x-3 md:mr-3">
          <button className="text-white h-[38px] rounded w-12 font-extralight text-sm hover:text-gray-300 transition duration-200">
            Login
          </button>
          <button className="bg-white text-black h-[32px] rounded w-20 font-extralight text-sm hover:bg-gray-200 transition duration-200">
            Signup
          </button>
        </div>
      </div>
      
    );
  }
  

export default Header