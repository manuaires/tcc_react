import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Cereais from "../pages/Cereais";
import Rac from "../pages/Rações";
import Var from "../pages/Variedades";
import "leaflet/dist/leaflet.css";
import View from "../pages/View.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/racoes" element={<Rac />} />
      <Route path="/variedades" element={<Var />} />
      <Route path="/cereais" element={<Cereais />} />
      <Route path="/view/:id" element={<View />} />
    </Routes>
  );
}
export default AppRoutes;
