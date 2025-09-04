import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";

export default function Footer() {
  return (
    <footer>
      <div className="bg-[#044a23] py-5 font-sans w-full text-center">
        <div className="flex justify-center items-center mb-2">
          <div className="flex items-center mx-4">
            <FaInstagram className="text-gray-300 hover:text-white transition-colors duration-500 text-2xl mr-2" />
            <a
              className="text-gray-300 hover:text-white transition-colors duration-500"
              href="#"
            >
              Instagram
            </a>
          </div>
          <div className="flex items-center mx-4">
            <FaWhatsapp className="text-gray-300 hover:text-white transition-colors duration-500 text-2xl mr-2" />
            <a
              className="text-gray-300 hover:text-white transition-colors duration-500"
              href="#"
            >
              Whatsapp
            </a>
          </div>
          <div className="flex items-center mx-4">
            <FiPhone className="text-gray-300 hover:text-white transition-colors duration-500 text-2xl mr-2" />
            <a
              className="text-gray-300 hover:text-white transition-colors duration-500"
              href="#"
            >
              Telefone
            </a>
          </div>
        </div>
        <div className="my-2 py-2 text-gray-400 text-sm">
          RBS CEREAIS Copyright © 2022 RBS || Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
