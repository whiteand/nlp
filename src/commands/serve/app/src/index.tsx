import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";

const element = document.getElementById("root");
if (!element) throw new Error("Root element not found");

const root = ReactDOM.createRoot(element);

root.render(<App />);
