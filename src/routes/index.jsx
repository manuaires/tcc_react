import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Cereais from "../pages/Cereais";
import Rac from "../pages/Rações";
import Var from "../pages/Variedades";
import "leaflet/dist/leaflet.css";
import View from "../pages/View.jsx";
import GerenciarProdutos from "../admin/GerenciarProdutos.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/racoes" element={<Rac />} />
      <Route path="/variedades" element={<Var />} />
      <Route path="/cereais" element={<Cereais />} />
      <Route path="/view/:categoria/:id" element={<View />} />
      <Route path="/admin" element={<GerenciarProdutos />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
export default AppRoutes;
