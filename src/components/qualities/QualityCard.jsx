export default function QualityCard({ icone, titulo, texto }) {
  return (
    <div
      className="bg-gray-100 rounded-xl p-3 w-55 h-45 flex flex-col items-center shadow-md hover:shadow-xl transition duration-300
      max-w-full max-h-full sm:w-55 sm:h-45"
    >
      <div className="mb-3 ">{icone}</div>
      <div className="font-semibold mb-2">{titulo}</div>
      <div className="text-center text-sm">{texto}</div>
    </div>
  );
}
