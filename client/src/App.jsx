import React from "react";
import router from './router.jsx'
import { RouterProvider } from "react-router-dom";
import './App.css'

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;