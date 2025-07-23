import { useState } from "react";
import CardPrev from "./CardPrev.jsx";
import Cereaisimg from "../../assets/cereais.png";

const categorias = ["Cereais", "Rações", "Variedades"];
const produtos = [
  {
    id: 1,
    nomeprod: "Milho",
    preço: "50",
    categoria: "Cereais",
    imagem: "src/assets/produtos/image.png",
  },
  {
    id: 2,
    nomeprod: "Arroz",
    preço: "5-15",
    categoria: "Cereais",
    imagem: Cereaisimg,
  },
  {
    id: 3,
    nomeprod: "Gato",
    preço: "3-8",
    categoria: "Rações",
    imagem: Cereaisimg,
  },
  {
    id: 4,
    nomeprod: "Gatinho",
    preço: "4-10",
    categoria: "Rações",
    imagem: Cereaisimg,
  },
  {
    id: 5,
    nomeprod: "Formilix",
    preço: "7-12",
    categoria: "Variedades",
    imagem: Cereaisimg,
  },
  {
    id: 6,
    nomeprod: "Adubo",
    preço: "6-14",
    categoria: "Variedades",
    imagem: Cereaisimg,
  },
  {
    id: 7,
    nomeprod: "jabu",
    preço: "8-18",
    categoria: "Cereais",
    imagem: Cereaisimg,
  },
  {
    id: 8,
    nomeprod: "Cachorro",
    preço: "5-10",
    categoria: "Rações",
    imagem: Cereaisimg,
  },
  {
    id: 9,
    nomeprod: "Sal blokus",
    preço: "4-9",
    categoria: "Variedades",
    imagem: Cereaisimg,
  },
  {
    id: 10,
    nomeprod: "Alfredo",
    preço: "12-22",
    categoria: "Cereais",
    imagem: Cereaisimg,
  },
  {
    id: 11,
    nomeprod: "Cachorrinho",
    preço: "6-11",
    categoria: "Rações",
    imagem: Cereaisimg,
  },
  {
    id: 12,
    nomeprod: "sla",
    preço: "5-10",
    categoria: "Variedades",
    imagem: Cereaisimg,
  },
  {
    id: 13,
    nomeprod: "gatão",
    preço: "5-10",
    categoria: "Rações",
    imagem: Cereaisimg,
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
    <section className="w-full bg-gray-100 py-12">
      <div className="container mx-auto px-2 sm:px-4">
        <h3 className="text-center text-3xl mt-8 mb-8 font-bold text-gray-800">
          Nossos Produtos
        </h3>
        <div className="flex justify-center gap-4 mb-6">
          {categorias.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full font-semibold ${
                categoriaSelecionada === cat
                  ? "bg-green-700 text-white"
                  : "bg-white hover:bg-green-700 hover:text-white text-gray-800 border"
              }`}
              onClick={() => setCategoriaSelecionada(cat)}
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
