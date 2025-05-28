import { useState, useEffect } from "react";
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function PageSkeleton() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    
    handleResize();


    window.addEventListener('resize', handleResize);


    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`h-screen w-screen flex overflow-hidden bg-white text-gray-800 ${isMobile ? 'flex-col' : 'flex-row'}`}>
      {/* Sidebar */}
      <div
        className={`
          h-full z-50 flex-shrink-0 bg-[#b8c2d1] shadow-xl
          fixed md:relative top-0 left-0
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-62 md:w-64 translate-x-0" : "w-0 -translate-x-full"}
          overflow-hidden
        `}
        style={{ zIndex: 50 }}
      >
        {isOpen && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
       
        <div
          onClick={toggleSidebar}
          className={`fixed top-3 left-3 z-50 p-2 rounded text-[#ffffff] hover:text-[#c4c4c4] cursor-pointer`}
          aria-label="Toggle Sidebar"
        >
          {isOpen ? (
            <TbLayoutSidebarLeftCollapseFilled className="w-6 h-6" />
          ) : (
            <TbLayoutSidebarLeftExpand className="w-6 h-6 text-[#ff6b6b]" />
          )}
        </div>
        {isMobile && isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          ></div>
        )}

        <main className={`flex-1 overflow-auto transition-all duration-300 ${isMobile ? "pt-10" : "pt-0"}`}>
          <Outlet context={{ isMobile }} />
        </main>
      </div>
    </div>
  );
}

export default PageSkeleton;