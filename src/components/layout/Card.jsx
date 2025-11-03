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
      <img
        src={`/produtos/${imagem}`}
        className="w-full h-40 object-cover mb-2 rounded"
        alt={nomeprod}
      />
      <h4 className="font-bold mt-2 text-gray-700 text-lg">{nomeprod}</h4>

      <Link
        to={`/view/${categoria}/${id}`}
        className="bg-green-700 w-full h-8 hover:bg-green-800 text-sm mt-4 text-white rounded-sm flex items-center justify-center"
      >
        Vizualizar Produto
      </Link>
    </div>
  );
}
