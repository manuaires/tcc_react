import { useState } from "react";
import CardPrev from "./CardPrev.jsx";
import Milho from "../../assets/produtos/image.png";
import CardP from "../layout/Card.jsx";

const categorias = ["Cereais", "Rações", "Variedades"];
const produtos = [
  {
    id: 1,
    nomeprod: "Milho",
    preço: "50",
    categoria: "Cereais",
    imagem: Milho,
  },
  {
    id: 2,
    nomeprod: "Arroz",
    preço: "5-15",
    categoria: "Cereais",
    imagem: Milho,
  },
  {
    id: 3,
    nomeprod: "Gato",
    preço: "3-8",
    categoria: "Rações",
    imagem: Milho,
  },
  {
    id: 4,
    nomeprod: "Gatinho",
    preço: "4-10",
    categoria: "Rações",
    imagem: Milho,
  },
  {
    id: 5,
    nomeprod: "Formilix",
    preço: "7-12",
    categoria: "Variedades",
    imagem: Milho,
  },
  {
    id: 6,
    nomeprod: "Adubo",
    preço: "6-14",
    categoria: "Variedades",
    imagem: Milho,
  },
  {
    id: 7,
    nomeprod: "jabu",
    preço: "8-18",
    categoria: "Cereais",
    imagem: Milho,
  },
  {
    id: 8,
    nomeprod: "Cachorro",
    preço: "5-10",
    categoria: "Rações",
    imagem: Milho,
  },
  {
    id: 9,
    nomeprod: "Sal blokus",
    preço: "4-9",
    categoria: "Variedades",
    imagem: Milho,
  },
  {
    id: 10,
    nomeprod: "Alfredo",
    preço: "12-22",
    categoria: "Cereais",
    imagem: Milho,
  },
  {
    id: 11,
    nomeprod: "Cachorrinho",
    preço: "6-11",
    categoria: "Rações",
    imagem: Milho,
  },
  {
    id: 12,
    nomeprod: "sla",
    preço: "5-10",
    categoria: "Variedades",
    imagem: Milho,
  },
];

export default function PreviewSection() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(
    categorias[0]
  );

  const produtosFiltrados = produtos.filter(
    (p) => p.categoria === categoriaSelecionada
  );

  return (
    <section className="w-full bg-gray-100 py-16 px-4">
      <div className="container mx-auto px-2 sm:px-4">
        <h3 className="text-center text-3xl mb-6 font-bold text-gray-700">
          Nossos Produtos
        </h3>
        <div className="flex justify-center gap-4 mb-4 text-green-800">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaSelecionada(cat)}
              className={`pb-1 border-b-2 ${
                categoriaSelecionada === cat
                  ? "border-green-600"
                  : "border-transparent"
              } hover:border-green-700 transition`} 
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {produtosFiltrados.slice(0, 4).map((prod) => (
            <CardPrev
              key={prod.id}
              id={prod.id}
              nomeprod={prod.nomeprod}
              preço={prod.preço}
              imagem={prod.imagem}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
