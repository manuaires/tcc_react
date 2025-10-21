import React from 'react';

const Footer = () => (
  <footer className="bg-[#02381b] text-gray-200 py-4 px-4 mt-2 relative">
    <div className="max-w-8xl mx-auto flex flex-wrap flex-col md:flex-row justify-between items-stretch gap-2 md:gap-4 md:ml-12 md:mr-40">
      <div className="flex flex-col items-start gap-2 w-full sm:w-1/2 md:w-1/4 min-w-[180px] max-w-full md:max-w-xs">
        <h3 className="text-lg mt-4 font-semibold mb-2">Contato</h3>
        <span>(15) 99846-6946 - Tiago</span>
        <span>(15) 99629-4597 - Eduardo</span>
        <span>(15) 99747-4223 - Financeiro</span>
        <span>rbscomerciocereais@gmail.com</span>
      </div>
      {/* Coluna Redes Sociais */}
      <div className="flex flex-col items-start gap-2 w-full sm:w-1/2 md:w-1/4 min-w-[180px] max-w-full md:max-w-xs">
        <h3 className="text-lg mt-4 font-semibold mb-2">Redes Sociais</h3>
        <a
          href="https://instagram.com/rbs_cereais"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-200 hover:text-white"
          aria-label="Instagram RBS Cereais"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-white">
            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
          </svg>
          <span className="font-medium">@rbs.cereais</span>
        </a>
      </div>
     
      <div className="w-full sm:w-1/2 md:w-2/5 mt-6 md:mt-4 flex flex-col justify-center md:justify-end min-w-[220px] max-w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d228.09050966049878!2d-47.70638620940256!3d-23.838214875499713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1759234763942!5m2!1spt-BR!2sbr"
          className="w-full h-[250px] md:h-[300px] rounded-lg"
          style={{
            border: 0,
            minWidth: "220px",
            width: "100%",
            maxWidth: "100%",
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização RBS Cereais"
        ></iframe>
        <div className="w-full text-center mt-2">
          <span>Estrada da Lavrinha km2 - S/N - Pilar do Sul</span>
        </div>
      </div>
    </div>
    <div className="flex items-end justify-between mt-6">
      <div className="text-center text-sm text-gray-400 w-full">
        © 2025 RBS Cereais. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
