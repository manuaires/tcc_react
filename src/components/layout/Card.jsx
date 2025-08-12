import { useOutletContext } from "react-router-dom";

export default function CardP({ id, nomeprod, preço, imagem }) {
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
    <div className="bg-gray-900 rounded-sm p-3 w-200 h-100 sm:w-70 sm:h-60 md:w-56 md:h-72 flex flex-col items-center shadow-md hover:shadow-xl transition duration-300 hover:scale-105">
      <img src={imagem} className="w-55 h-35 object-cover mb-2 rounded" />
      <h4 className="font-bold mt-2 text-gray-700 text-lg">{nomeprod}</h4>
      <p className="text-green-700 font-semibold">R$ {preço}</p>
      <button onClick={handleAdd} className="bg-green-700 w-full h-8 hover:bg-green-800 text-sm mt-4 text-white rounded-sm">
        Compre Agora
      </button>
    </div>
  );
}
