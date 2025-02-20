import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// for wordpress
const rootElement = document.getElementById("ws-booking-root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// for react testing
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
