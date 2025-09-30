import React from 'react';

const Footer = () => (
  <footer className="bg-[#02381b] text-gray-200 py-4 px-4 mt-2 relative">
    <div className="max-w-8xl mx-auto flex flex-wrap flex-col md:flex-row justify-between items-stretch gap-2 md:gap-4 md:ml-12 md:mr-40">
      <div className="flex flex-col items-start gap-2 w-full sm:w-1/2 md:w-1/4 min-w-[180px] max-w-full md:max-w-xs">
        <h3 className="text-lg mt-4 font-semibold mb-2">Contato</h3>
        <span>(15) 99999-9999</span>
        <span>rbs@paidamanutwink.com</span>
        <span>Endereço: Rua da Lavinia, 123 - Centro</span>
      </div>
      {/* Coluna Redes Sociais */}
      <div className="flex flex-col items-start gap-2 w-full sm:w-1/2 md:w-1/4 min-w-[180px] max-w-full md:max-w-xs">
        <h3 className="text-lg mt-4 font-semibold mb-2">Redes Sociais</h3>
        <span>Twitter: @gordinhorosa</span>
        <span>Facebook: facebook.com/josebezerra</span>
        <span>Instagram: @blabla</span>
      </div>
     
      <div className="w-full sm:w-1/2 md:w-2/5 mt-6 md:mt-4 flex justify-center md:justify-end min-w-[220px] max-w-full">
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
