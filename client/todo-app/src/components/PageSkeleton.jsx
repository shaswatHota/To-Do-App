import { useState, useEffect } from "react";
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function PageSkeleton() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check screen size and update mobile state
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    // Set initial state based on screen size
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#c9cfdb] text-gray-800">
      {/* Sidebar */}
      <div
        className={`h-full z-50 flex-shrink-0 bg-[#b8c2d1] shadow-xl
          transition-all duration-300 ease-in-out
          ${isMobile ? "fixed" : "relative"} z-40
          ${isOpen ? "w-62 translate-x-0" : "w-0 -translate-x-full"}`}
      >
        {isOpen && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>

      {/* Main content */}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sidebar toggle button - fixed top-left */}
        <div
          onClick={toggleSidebar}
          className={`fixed top-5 left-5 z-50 p-2 rounded text-[#687486] hover:text-[#4c5566] `}
          aria-label="Toggle Sidebar"
        >
          {isOpen ? (
            <TbLayoutSidebarLeftCollapseFilled className="w-6 h-6" />
          ) : (
            <TbLayoutSidebarLeftExpand className="w-6 h-6" />
          )}
        </div>
        {isMobile && isOpen && (
          <div
            className="absolute inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
        )}


        <main className={`flex-1 overflow-auto transition-all duration-300 ${isMobile ? "pt-10" : "pt-0"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PageSkeleton;