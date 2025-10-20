import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home.jsx";
import Cereais from "./pages/Cereais.jsx";
import Rac from "./pages/Rações.jsx";
import Var from "./pages/Variedades.jsx";
import App from "./App.jsx";
import View from "./pages/View.jsx";
import GerenciarProdutos from "./admin/GerenciarProdutos.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Usuario from "./pages/Usuario.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/cereais", element: <Cereais /> },
      { path: "/racoes", element: <Rac /> },
      { path: "/variedades", element: <Var /> },
      { path: "/view/:categoria/:id", element: <View /> },
      { path: "/admin", element: <GerenciarProdutos /> },
      {path: "/register", element: <Register /> },
      {path: "/login", element: <Login /> },
      {path: "/usuario", element: <Usuario /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
