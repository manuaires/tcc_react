import React from "react";

export default function CardPrev({
  imagem = "",
  nomeprod = "Produto",
  handleAdd = () => {},
}) {
  return (
    <div className="bg-white rounded-sm p-3 w-52 h-auto sm:w-52 sm:h-64 md:w-64 md:h-80 flex flex-col items-center shadow-md hover:shadow-xl transition duration-300 hover:scale-105">
      
      {/* 🖼️ Container da imagem */}
      <div className="w-full h-40 sm:h-44 md:h-52 lg:h-64 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
        {imagem ? (
          <img
            src={imagem}
            alt={nomeprod || "produto"}
            className="max-w-full max-h-full object-contain object-center"
          />
        ) : (
          <div className="text-gray-400 text-sm">Sem imagem</div>
        )}
      </div>

      <h4 className="font-bold mt-2 text-gray-700 text-lg text-center">
        {nomeprod}
      </h4>
      
      <button
        type="button"
        onClick={handleAdd}
        className="bg-green-700 w-full h-8 hover:bg-green-800 text-sm mt-4 text-white rounded-sm flex items-center justify-center"
      >
        Visualizar Produto
      </button>
    </div>
  );
}
