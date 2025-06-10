import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Remove overflow:hidden after React is ready
function releaseOverflow() {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  releaseOverflow() // Call after mount
);
