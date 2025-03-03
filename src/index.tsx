import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "../src/root.css";
import NewIndex from "./Frontend/pages";
import { AppProvider } from "./Frontend/context/context";
import App from "./app";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
    <BrowserRouter basename={"/"}>
      <AppProvider>
          <App />
      </AppProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
