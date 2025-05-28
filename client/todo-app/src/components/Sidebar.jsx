import '../App.css';
import CLink from "./CLink";
import { IoIosLogOut } from "react-icons/io";


const Sidebar = () => {

  function logoutFunc(){
    localStorage.removeItem('token');
    window.location.href = '/';
  }
  return (
    <div className="h-full min-h-screen w-64 bg-gradient-to-r from-[#FD6A5E] to-[#FF8A7A] flex flex-col rounded-r-md p-6 shadow-xl pt-24">
      
      <div className="mb-8">
        {/* <h2 className="text-2xl font-bold text-white tracking-tight pl-2 mb-8">
          <span className="text-[#ffb3b3]">Dash</span>board
        </h2> */}
      </div>
      
      <ul className="flex-1 space-y-2 text-white ">
        <li>
          <CLink
            to="/todo"
            className={({ isActive }) =>
              `mb-2 px-4 py-3 block rounded-lg transition hover:cursor-pointer font-semibold ${isActive ? "bg-white text-[#ff6b6b]" : "hover:bg-white/10"}`
            }
          >
            Dashboard
          </CLink>
        </li>
        <li>
          <CLink
            to="/roadmapai"
            className={({ isActive }) =>
              `mb-2 px-4 py-3 block rounded-lg transition hover:cursor-pointer font-semibold ${isActive ? "bg-white text-[#ff6b6b]" : "hover:bg-white/10"}`
            }
          >
            Road Map AI
          </CLink>
        </li>
        {/* <li>
          <CLink
            to="/settings"
            className={({ isActive }) =>
              `mb-2 px-4 py-3 block rounded-lg transition hover:cursor-pointer font-semibold ${isActive ? "bg-white text-[#ff6b6b]" : "hover:bg-white/10"}`
            }
          >
            Settings
          </CLink>
        </li> */}
        <li>
          <CLink
            to="/profile"
            className={({ isActive }) =>
              `mb-2 px-4 py-3 block rounded-lg transition hover:cursor-pointer font-semibold ${isActive ? "bg-white text-[#ff6b6b]" : "hover:bg-white/10"}`
            }
          >
            Profile
          </CLink>
        </li>
      </ul>
      {/* Logout Button */}
      <div className="mt-auto pt-8">
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white/20 text-white hover:bg-white/30 cursor-pointer font-semibold" onClick={logoutFunc}>
          <span className="material-icons text-lg" ><IoIosLogOut/></span>
          Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
