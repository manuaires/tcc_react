import NavBar from "../components/navbar/NavBar";
import SiteBot from "../components/form/sitebot.jsx";
export default function Pedido() {
  return (
    <>
      <NavBar initialGreen={true} />

      <main className="min-h-screen flex items-start md:items-center justify-center bg-gray-100 p-4 pt-24 md:pt-32">
        <div className="w-full max-w-4xl">
          <SiteBot />
        </div>
      </main>
    </>
  );
}
