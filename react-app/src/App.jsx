import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Team from "./sub_pages/Team";
import LoadScript from "./sub_pages/LoadScript";
import WorldMapPage from "./sub_pages/GameWorldMap";
import Home from "./sub_pages/Home";
import CreativeSuite from "./sub_pages/CreativeSuite";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home></Home>} />
            <Route path="/game-worldmap" element={<WorldMapPage />} />
            <Route path="/loadscript" element={<LoadScript />} />
            <Route path="/team" element={<Team />} />
            <Route path="/creative-suite" element={<CreativeSuite />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
