import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";

// Note: we intentionally don't wrap <App /> in <StrictMode> here.
// In development, StrictMode mounts every component twice, and the second
// mount would try to reuse the "entries-changes" channel from TODO 4 while
// it is still being removed. That causes confusing errors for beginners.
createRoot(document.getElementById("root")).render(<App />);
