function HeaderAndLandingHome() {
    return (
      <div className="relative w-screen  overflow-auto overflow-x-hidden bg-[radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
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
            <button className="text-white h-[38px] rounded w-12 font-extralight text-sm hover:text-gray-300 transition duration-200">
              Login
            </button>
            <button className="bg-white text-black h-[32px] rounded w-20 font-extralight text-sm hover:bg-gray-200 transition duration-200">
              Signup
            </button>
          </div>
        </div>
  
        {/* Home Content */}
        <div className="w-full flex flex-col items-center justify-center pt-[60px] min-h-screen">
          {/* Small Text under Logo */}
          <div className="text-center h-7 mt-12 text-sm text-white md:h-7 md:w-[250px] border-2 border-white rounded-[14px] mb-4">
            <p className="p-1 tracking-wide uppercase">A perfect workspace</p>
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
            <button className="bg-blue-500 sm:w-full text-white font-medium rounded-[13px] py-1 px-8 text-base md:text-lg hover:bg-blue-600 transition duration-300 shadow-lg">
              Get Started
            </button>
          </div>
  
          {/* Features boxes */}
          <div className="w-full flex flex-wrap justify-center gap-7 mt-14">

          <div className="sm:w-1/2 pl-7 pt-10 h-[240px] border-[1px] border-gray-400 rounded-[4px] md:w-[250px] p-4 flex flex-col items-start">
            <div className="flex items-start ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mr-2" viewBox="0 0 640 512">
                <path fill="#c2c2c2" d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z" />
                </svg>
            </div>
                <h3 className="text-md font-semibold  mb-1 mt-4">Meeting Room</h3>
            <p className="text-[13px] font-thin text-gray-300">Real Time meeting Room with shared white board.</p>
            </div>

            <div className="sm:w-1/2 pl-7 pt-10 h-[240px] border-[1px] border-gray-400 rounded-[4px] md:w-[250px] p-4 flex flex-col items-start">
            <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mr-2" viewBox="0 0 512 512"><path fill="#c2c2c2" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/></svg>
            </div>
                <h3 className="text-md font-semibold mb-1 mt-4">Publish your doc online</h3>
            <p className="text-[13px] font-thin text-gray-300">Publish your work online.</p>
            </div>

           
          {/* <div className="sm:w-1/2 pl-7 pt-10 h-[240px] border-[1px] border-gray-400 rounded-[4px] md:w-[250px] p-4 flex flex-col items-start">
            <div className="flex items-start ">
                <img src="/pen-to-square-solid (1).svg" className="h-6 mr-2" alt="" />
            </div>
                <h3 className="text-md font-semibold  mb-1 mt-4">Publish your doc online</h3>
            <p className="text-[13px] font-thin text-gray-300">Publish your work online</p>
            </div> */}

           
            <div className="sm:w-1/2 pl-7 pt-10 h-[240px] border-[1px] border-gray-400 rounded-[4px] md:w-[250px] p-4 flex flex-col items-start">
            <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 mr-2" viewBox="0 0 640 512" fill="#c2c2c2">
                <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z" />
                </svg>
            </div>
                <h3 className="text-md font-semibold mb-1 mt-4">Real Time Collab</h3>
            <p className="text-[13px] font-thin text-gray-300">Connect with people and work on a same Doc Realtime.</p>
            </div>

           
            <div className="sm:w-1/2 pl-7 pt-10 h-[240px] border-[1px] border-gray-400 rounded-[4px] md:w-[250px] p-4 flex flex-col items-start">
            <div className="flex items-start">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 mr-2"
                viewBox="0 0 640 512"
                fill="#c2c2c2"
                >
                <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
                </svg>
            </div>
                <h3 className="text-md font-semibold mb-1 mt-4">Ai text completion</h3>
            <p className="text-[13px] font-thin text-gray-300">Real Time meeting Room with shared white board.</p>
            </div>

           

           
           
            </div>

        </div>
      </div>
    );
  }
  
  export default HeaderAndLandingHome;
  