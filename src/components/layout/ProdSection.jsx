import CardProd from "./Card";

export default function ProdSection({ produtos, categoria }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {produtos.length > 0 ? (
        produtos.map((p) => (
          <CardProd key={p.Id} id={p.Id} nomeprod={p.Nome} imagem={p.Foto} categoria={categoria}/>
        ))
      ) : (
        <p className="text-gray-500">Nenhum produto encontrado.</p>
      )}
    </div>
  );
}
