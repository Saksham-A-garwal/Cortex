import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.jsx";
import "./index.css";
import App from "./App.jsx";
import store from "./Store/store.js";
import { Provider } from "react-redux";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Provider store={store} >
        <App />
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
