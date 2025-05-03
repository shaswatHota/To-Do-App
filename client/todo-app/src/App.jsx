// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TodoPage from "./components/TodoPage";
import './App.css';
import Signup from "./components/SignUp";
import Signin from "./components/SignIn";


function App() {
  return (
    <div>
         <Router>
      <Routes>
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/signin" element={<Signin/>} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </Router>
    </div>
  );
}

export default App;
