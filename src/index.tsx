import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./root.css";
import App from "./Frontend";
import NewIndex from "./pages/newindex";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={"/"}>
      <div className="App">
        <Routes>
          <Route path={"/"} element={<NewIndex />} />
        </Routes>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
