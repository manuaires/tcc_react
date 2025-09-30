import React from 'react';

const Footer = () => (
  <footer className="bg-[#044a23] text-gray-200 py-8 px-4 mt-2 relative">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-4">
      <div className="flex flex-col items-center justify-center gap-4 w-full md:w-2/4 py-15">
        <nav className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 items-center justify-center">
          <a href="#" className="hover:text-white transition text-lg">Início</a>
          <a href="#" className="hover:text-white transition text-lg">Sobre</a>
          <a href="#" className="hover:text-white transition text-lg">Funcionamento</a>
        </nav>
        <div className="flex flex-col items-center w-full gap-2">
          <div className="flex space-x-6 justify-center items-center">
            <a href="#" aria-label="Twitter" className="hover:text-white transition text-lg">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-white transition text-lg">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white transition text-lg">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.011 3.584-.069 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.011-4.85-.069c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.808 2.256 6.088 2.243 6.497 2.243 12c0 5.503.013 5.912.072 7.192.059 1.276.353 2.449 1.32 3.416.967.967 2.14 1.261 3.416 1.32 1.28.059 1.689.072 7.192.072s5.912-.013 7.192-.072c1.276-.059 2.449-.353 3.416-1.32.967-.967 1.261-2.14 1.32-3.416.059-1.28.072-1.689.072-7.192s-.013-5.912-.072-7.192c-.059-1.276-.353-2.449-1.32-3.416C21.051.425 19.878.131 18.602.072 17.322.013 16.913 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
          </div>
          <div className="flex items-center gap-2 mt-2 text-lg flex-col">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/></svg>
              <span>Seg a Sex: 8h às 18h</span>
            </div>
            <span className="ml-8">Sábado: 8h ás 12h</span>
          </div>
        </div>
      </div>
      <div className="w-full md:w-2/4 mt-6 md:mt-0 flex justify-center md:justify-end">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d228.09050966049878!2d-47.70638620940256!3d-23.838214875499713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1759234763942!5m2!1spt-BR!2sbr"
          width="100%"
          height="240"
          style={{
            border: 0,
            borderRadius: "10px",
            minWidth: "220px",
            maxWidth: "500px",
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização RBS Cereais"
        ></iframe>
      </div>
    </div>
    <div className="flex items-end justify-between mt-6">
      <div className="text-center text-sm text-gray-400 w-full">
        © 2024 Meu Site. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
