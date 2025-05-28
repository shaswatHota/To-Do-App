import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [showMessage, setShowMessage] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [messageText, setMessageText] = useState("Coming Soon");
  const tooltipRef = useRef();
  const darkModeRef = useRef(null);
  const notificationsRef = useRef(null);

  function logoutFunc(){
    localStorage.removeItem('token');
    window.location.href = '/';
  }
  const dummyFunc = (e, text) => {
    setMessageText(text);
    const rect = e.target.getBoundingClientRect();
    setTooltipStyle({
      top: rect.top - 30 + window.scrollY,
      left: rect.left + rect.width / 2 + window.scrollX,
    });

    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 2000); 
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  const getInitial = (email) => email?.charAt(0).toUpperCase();

  return (
    <div>
      <div className="flex pt-44 items-center justify-center h-full bg-gray-50">
        <div className="bg-gray-200 shadow-md rounded-2xl p-8 w-xl text-center">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#FD6A5E] to-[#FF8A7A] text-white text-4xl flex items-center justify-center">
              {getInitial(user.email)}
            </div>
            <p className="m-7 text-gray-600 mb-6">{user.email}</p>
          </div>
        </div>
      </div>

      
      <div
        ref={tooltipRef}
        className={`fixed z-50 bg-gray-400 text-white px-3 py-1 rounded-lg text-sm pointer-events-none transition-opacity duration-500 ease-in-out ${
          showMessage ? "opacity-100" : "opacity-0"
        }`}
        style={{
          position: "absolute",
          transform: "translateX(-50%)",
          ...tooltipStyle,
        }}
      >
        {messageText}
      </div>

      <div className="h-full w-full flex justify-center">
        <div className="w-xl bg-gradient-to-r from-[#FD6A5E] to-[#FF8A7A] rounded-b-lg">
          <div className="flex flex-col items-center w-fit m-auto space-y-2 py-4">
            <div
              ref={darkModeRef}
              onClick={(e) => dummyFunc(e, "Coming Soon")}
              className="cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-[#ff8988] transition"
            >
              Dark Mode
            </div>
            <div
              ref={notificationsRef}
              onClick={(e) => dummyFunc(e, "Coming Soon")}
              className="cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-[#ff8988] transition"
            >
              Notifications
            </div>
            <div
              onClick={logoutFunc}
              className="cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
