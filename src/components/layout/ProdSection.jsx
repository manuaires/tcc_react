import CardProd from "./Card";

export default function ProdSection() {
  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="container mx-auto px-2 sm:px-4">
        <h3 className="text-center text-3xl mb-6 font-bold text-gray-700">
          
        </h3>
        <div className="flex flex-wrap justify-center gap-10">
          <CardProd />
          <CardProd />
          <CardProd />
          <CardProd />
        </div>
      </div>
    </section>
  );
}