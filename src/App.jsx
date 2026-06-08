import "@/styles/app.css";
import "@/styles/navbar.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage   from "./pages/Landing";
import TamilJainPage from "./pages/TamilJain";
import AboutPage     from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<LandingPage />} />
        <Route path="/tamil-jain" element={<TamilJainPage />} />
        <Route path="/about"      element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
