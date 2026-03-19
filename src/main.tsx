import { createRoot } from "react-dom/client";
import { inject } from "@vercel/analytics";
import App from "./app/App.tsx";
import "./styles/index.css";

inject({ debug: false });

// Always start at the top of the page on load/refresh
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

createRoot(document.getElementById("root")!).render(<App />);