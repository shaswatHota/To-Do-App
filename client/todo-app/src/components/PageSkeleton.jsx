import { useState} from 'react';
import {TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';




function PageSkeleton() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='grid grid-cols-6 min-h-screen w-screen bg-[#c9cfdb] text-gray-800 '>
      {/* sidebar */}
      <div className={`col-span-1 bg-[#b8c2d1] transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-xl`}>
        <Sidebar/>
      </div>
        {/* Main Content */}
         <div
          className={` absolute p-2 text-gray-500 top-2 left-48 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-44'} hover:cursor-pointer`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <TbLayoutSidebarLeftCollapseFilled className='w-6 h-6' />  : <TbLayoutSidebarLeftExpand  className='w-6 h-6'/> }
        </div>
      <div className='col-span-4 flex flex-col items-center pt-10'>
        <Outlet/>
      </div>

      <div className='col-span-1'></div>
    </div>
    
  );
}

export default PageSkeleton;
