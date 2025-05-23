// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Signup from "./components/SignUp";
import Signin from "./components/SignIn";
import PageSkeleton from "./components/PageSkeleton";
import TodoPage from "./Pages/TodoPage";
import RoadMapAI from "./Pages/RMAiPage";

function App() {
  return (
    <div>
         <Router>
      <Routes>
        <Route path="/signup" element={<Signup/>} />
         <Route path="/signin" element={<Signin/>} />
        <Route path="/" element={<PageSkeleton />}>

            <Route path="/roadmapai" element={<RoadMapAI/>} />
            <Route path="/todo" element={<TodoPage />} />
            {/* <Route path="/home" element={<HomePage/>} />
            <Route path="/goal" element={<GoalPage/>} />
            
            
            <Route path="/settings" element={<SettingsPage/>} />
            <Route path="/profile" element={<ProfilePage/>} /> */}
            


           {/* <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} /> */}

        </Route>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
