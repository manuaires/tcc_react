import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Cereais from "../pages/Cereais.jsx";
import Rac from "../pages/Rações.jsx";
import Var from "../pages/Variedades.jsx";
import "leaflet/dist/leaflet.css";
import View from "../pages/View.jsx";
import GerenciarProdutos from "../admin/GerenciarProdutos.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import Usuario from "../pages/Usuario.jsx";
import Orcamento from "../pages/Orcamento.jsx";
import Pedido from "../pages/Pedido.jsx";

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
      <Route path="/usuario" element={<Usuario />} />
      <Route path="/orcamento" element={<Orcamento />} />
      <Route path="/pedido" element={<Pedido />} />
    </Routes>
  );
}
export default AppRoutes;
