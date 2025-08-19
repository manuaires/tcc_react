import CardProd from "./Card";

export default function ProdSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      <CardProd />
      <CardProd />
      <CardProd />
      <CardProd />
    </div>
  );
}