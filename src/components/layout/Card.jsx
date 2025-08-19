import { useOutletContext } from "react-router-dom";

export default function CardProd({ id, nomeprod, preço, imagem }) {
  const { addToCart } = useOutletContext();

  const handleAdd = () => {
    addToCart({
      id,
      nomeprod,
      preço,
      imagem,
    });
  };

  return (
    <div className="border border-gray-300 bg-gray-50 rounded-sm p-3 w-96 h-96 sm:w-50 sm:h-34 md:w-70 md:h-90 flex flex-col items-center shadow-md hover:shadow-xl transition duration-300 hover:scale-105">
      <img src={imagem} className="w-72 h-48 object-cover mb-2 rounded" />
      <h4 className="font-bold mt-2 text-gray-700 text-lg">{nomeprod}</h4>
      <p className="text-green-700 font-semibold">R$ {preço}</p>
      <button onClick={handleAdd} className="bg-green-700 w-full h-8 hover:bg-green-800 text-sm mt-4 text-white rounded-sm">
        Compre Agora
      </button>
    </div>
  );
}
