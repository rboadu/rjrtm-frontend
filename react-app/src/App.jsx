import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Team from "./sub_pages/Team";
import LoadScript from "./sub_pages/LoadScript";
import WorldMapPage from "./sub_pages/WorldMapPage";
import Home from "./sub_pages/Home";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home></Home>} />
          <Route path="/worldmap" element={<WorldMapPage />} />
          <Route path="/loadscript" element={<LoadScript />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
