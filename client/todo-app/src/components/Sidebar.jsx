import '../App.css';
import CLink from "./CLink";

const Sidebar = () => {
  return (
    <div>
      <div className='flex '>

        <h2 className="text-2xl pl-18 font-bold text-gray-500 m-5 ">Sidebar</h2>

      </div>
      
      <ul className="hover:cursor-pointer text-gray-600">
        <li>
          <CLink
            to="/home"
            className={({ isActive }) =>
              `mb-2 pl-5 block hover:bg-[#aeb8c9] ${isActive ? "bg-[#aeb8c9]" : ""}`
            }
          >
            Home
          </CLink>
        </li>
        <li>
          <CLink
            to="/goal"
            className={({ isActive }) =>
              `mb-2 pl-5 block hover:bg-[#aeb8c9] ${isActive ? "bg-[#aeb8c9]" : ""}`
            }
          >
            Goal
          </CLink>
        </li>
        <li>
          <CLink
            to="/roadmapai"
            className={({ isActive }) =>
              `mb-2 pl-5 block hover:bg-[#aeb8c9] ${isActive ? "bg-[#aeb8c9]" : ""}`
            }
          >
            Road Map AI
          </CLink>
        </li>
        <li>
          <CLink
            to="/todo"
            className={({ isActive }) =>
              `mb-2 pl-5 block hover:bg-[#aeb8c9] ${isActive ? "bg-[#aeb8c9]" : ""}`
            }
          >
            Todo
          </CLink>
        </li>
        <li>
          <CLink
            to="/settings"
            className={({ isActive }) =>
              `mb-2 pl-5 block hover:bg-[#aeb8c9] ${isActive ? "bg-[#aeb8c9]" : ""}`
            }
          >
            Settings
          </CLink>
        </li>
        <li>
          <CLink
            to="/profile"
            className={({ isActive }) =>
              `mb-2 pl-5 block hover:bg-[#aeb8c9] ${isActive ? "bg-[#aeb8c9]" : ""}`
            }
          >
            Profile
          </CLink>
        </li>
        
      </ul>
    </div>
  );
};

export default Sidebar;
