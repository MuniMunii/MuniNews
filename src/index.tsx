import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "../src/root.css";
import NewIndex from "./Frontend/pages";
import { ThemeProvider } from "./Frontend/context/context";
import App from "./app";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={"/"}>
      <ThemeProvider>
          <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
