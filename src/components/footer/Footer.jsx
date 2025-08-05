import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { CiPhone } from "react-icons/ci";
import MapFooter from "./MapFooter.jsx";

export default function Footer() {
  return (
    <footer>
      <div className="bg-[#044a23] py-5 font-sans w-full text-center">
        {/* Redes sociais */}
        <div className="flex justify-center items-center mb-2">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-500 mx-2 text-2xl"
          >
            <FaInstagram />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-500 mx-2 text-2xl"
          >
            <FaWhatsapp />
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-500 mx-2 text-2xl"
          >
            <CiPhone />
          </a>
        </div>

        <div className="flex justify-center items-center mb-2">
          <ul className="flex justify-center items-center flex-wrap">
            <li className="inline-block mx-4">
              <a className="text-gray-300">Instagram</a>
            </li>
            <li className="inline-block mx-4">
              <a className="text-gray-300">Whatsapp</a>
            </li>
            <li className="inline-block mx-4">
              <a className="text-gray-300">Telefone</a>
            </li>
          </ul>
        </div>
    <MapFooter />
        {/* Direitos autorais */}
        <div className="my-2 py-2 text-gray-500 text-sm">
          RBS CEREAIS Copyright © 2022 RBS || Todos os direitos reservados
        </div>
      </div>

    </footer>
  );
}
