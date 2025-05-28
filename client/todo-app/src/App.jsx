import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Signup from "./components/SignUp";
import Signin from "./components/SignIn";
import TodoPage from "./Pages/TodoPage";
import RoadMapAI from "./Pages/RMAiPage";
import ProfilePage from "./Pages/ProfilePage";
import RootRouteHandler from "./components/RootRouteHandler";
import PageSkeleton from "./components/PageSkeleton";

function App() {
  return (
    <div>
         <Router>
      <Routes>
        <Route path="/signup" element={<Signup/>} />
         <Route path="/signin" element={<Signin/>} />
        <Route path="/" element={<RootRouteHandler />}>
          

            <Route path="/roadmapai" element={<RoadMapAI/>} />
            <Route path="/todo" element={<TodoPage />} />
            {/* <Route path="/home" element={<HomePage/>} />
            <Route path="/goal" element={<GoalPage/>} />
            
            
            <Route path="/settings" element={<SettingsPage/>} />*/}
            <Route path="/profile" element={<ProfilePage/>} />
            


        </Route>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
