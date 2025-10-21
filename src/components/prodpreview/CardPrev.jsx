import { useOutletContext } from "react-router-dom";

export default function CardPrev({ imagem, nomeprod, handleAdd }) {
  return (
    <div className="bg-white rounded-sm p-3 w-52 h-auto sm:w-52 sm:h-64 md:w-64 md:h-80 flex flex-col items-center shadow-md hover:shadow-xl transition duration-300 hover:scale-105">
      
      {/* 🖼️ Container da imagem */}
      <div className="w-full h-40 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
        <img
          src={imagem}
          alt={nomeprod}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <h4 className="font-bold mt-2 text-gray-700 text-lg text-center">
        {nomeprod}
      </h4>
      
      <button
        onClick={handleAdd}
        className="bg-green-700 w-full h-8 hover:bg-green-800 text-sm mt-4 text-white rounded-sm"
      >
        Visualizar Produto
      </button>
    </div>
  );
}
