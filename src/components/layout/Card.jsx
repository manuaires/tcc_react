import { /*useOutletContext,*/ Link } from "react-router-dom";

export default function CardProd({ id, nomeprod, imagem, categoria }) {
  /*const { addToCart } = useOutletContext();

  const handleAdd = () => {
    addToCart({
      id,
      nomeprod,
      imagem,
    });
  };*/

  return (
    <div className="bg-white rounded-sm p-3 w-52 h-auto sm:w-52 sm:h-64 md:w-64 md:h-80 flex flex-col items-center shadow-xl hover:shadow-lg transition duration-300 hover:scale-105">
      
      {/* Contêiner da imagem para controlar proporção e overflow */}
      <div className="w-full h-40 sm:h-44 md:h-52 lg:h-64 flex items-center justify-center bg-gray-50 rounded overflow-hidden mb-2">
        {imagem ? (
          <img
            src={`/produtos/${imagem}`}
            alt={nomeprod}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-gray-400 text-sm">Sem imagem</div>
        )}
      </div>

      <h4 className="font-bold mt-2 text-gray-700 text-lg text-center">{nomeprod}</h4>

      <Link
        to={`/view/${categoria}/${id}`}
        className="bg-green-700 w-full h-10 hover:bg-green-800 text-sm mt-4 text-white rounded-sm flex items-center justify-center"
      >
        Vizualizar Produto
      </Link>
    </div>
  );
}
