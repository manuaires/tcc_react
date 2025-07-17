export default function CardPrev({ img, nomeprod, preço }) {
  return (
    <div className="bg-white rounded-sm p-3 w-36 h-40 sm:w-44 sm:h-60 md:w-56 md:h-72 flex flex-col items-center shadow-md hover:shadow-2xl transition duration-300">
      <img src={img} className="w-55 h-35 object-cover mb-2 rounded" />
      <h4 className="font-bold mt-2 text-gray-900 text-lg">{nomeprod}</h4>
      <p className="text-green-700 font-semibold">R$ {preço}</p>
      <button className="bg-green-700 w-full h-8 hover:bg-green-800 text-sm mt-4 text-white rounded-sm">
        Compre Agora
      </button>
    </div>
  );
}
