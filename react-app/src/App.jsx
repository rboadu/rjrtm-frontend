import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Team from "./sub_pages/Team";
import LoadScript from "./sub_pages/LoadScript"; 
import WorldMapPage from "./sub_pages/WorldMapPage";


import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<div style={{ padding: "5rem" }}><h1>RJRTM Frontend</h1></div>} />
          <Route path="/loadscript" element={<LoadScript />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;