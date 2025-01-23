import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./root.css";
import NewIndex from "./pages/newindex";
import { ThemeProvider } from "./Frontend/context/theme";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={"/"}>
    <ThemeProvider>
      <div className="App">
        <Routes>
          <Route path={"/"} element={<NewIndex />} />
        </Routes>
      </div>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
