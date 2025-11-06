
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ReactGA from "react-ga4";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./index.css";

ReactGA.initialize("G-JQ9B5W0GPL");

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
  