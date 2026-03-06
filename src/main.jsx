import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css";
import { PortfolioProvider } from "./context/PortfolioContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PortfolioProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PortfolioProvider>
  </React.StrictMode>
);
