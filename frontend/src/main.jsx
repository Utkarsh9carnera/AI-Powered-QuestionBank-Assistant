import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <GoogleOAuthProvider
    clientId="633295363156-206nagppl918eh9apqmcpm49k1fbrqpi.apps.googleusercontent.com"
  >
    <App />
  </GoogleOAuthProvider>
);