import { useOutletContext } from "react-router-dom";

export default function CardProd({ id, nomeprod, imagem }) {
  const { addToCart } = useOutletContext();

  const handleAdd = () => {
    addToCart({
      id,
      nomeprod,
      imagem,
    });
  };

  return (
    <div className="bg-white rounded-sm p-3 w-52 h-auto sm:w-52 sm:h-64 md:w-64 md:h-80 flex flex-col items-center shadow-md hover:shadow-xl transition duration-300 hover:scale-105">
      <img src={imagem} className="w-60 h-40 object-cover mb-2 rounded" />
      <h4 className="font-bold mt-2 text-gray-700 text-lg">{nomeprod}</h4>
      <button
        onClick={handleAdd}
        className="bg-green-700 w-full h-8 hover:bg-green-800 text-sm mt-4 text-white rounded-sm"
      >
        Compre Agora
      </button>
    </div>
  );
}
