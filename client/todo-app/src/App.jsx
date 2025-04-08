// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TodoPage from "./components/TodoPage";
import './App.css';


function App() {
  return (
    <div>
         <Router>
      <Routes>
        <Route path="/" element={<TodoPage />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </Router>
    </div>
  );
}

export default App;
