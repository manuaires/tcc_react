import CardProd from "./Card";

export default function ProdSection({ produtos }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {produtos.length > 0 ? (
        produtos.map((p) => (
          <CardProd
            key={p.Id_prod}
            id={p.Id_prod}
            nomeprod={p.Nome_prod}
            preço={p.Preco_prod}
            imagem={p.Foto_prod}
          />
        ))
      ) : (
        <p className="text-gray-500">Nenhum produto encontrado.</p>
      )}
    </div>
  );
}
