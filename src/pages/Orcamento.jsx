import NavBar from "../components/navbar/NavBar";
import OrderForm from "../components/form/OrderForm";
import Footer from "../components/footer/Footer";

export default function Orcamento() {
  return (
    <>
      <NavBar initialGreen={true} />

      {/* Main container: keeps same spacing pattern used in other pages */}
      <main className="min-h-screen flex items-start md:items-center justify-center bg-gray-100 p-4 pt-24 md:pt-32">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Solicitar Orçamento</h1>
          <OrderForm />
        </div>
      </main>
    </>
  );
}
