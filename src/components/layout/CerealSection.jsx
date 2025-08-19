import ProdSection from "./ProdSection";

export default function CerealSection() {
  return (
    <section className="py-15 flex flex-col justify-center items-center w-full gap-13">
      <ProdSection />
      <ProdSection />
      <ProdSection />
    </section>
  );
}