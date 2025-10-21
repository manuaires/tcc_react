import comofunciona from "../../assets/comofunciona.png"

const steps = [
    {
        number:  "01",
        title: "Escolha seus produtos",
        description: "Navegue pelo nosso catálogo e selecione os produtos que você deseja comprar, escolhendo com facilidade e rapidez.",
    },
    {
        number:  "02",
        title: "Adicione ao carrinho",
        description: "Clique no botão 'Compre Agora' para adicionar os produtos selecionados ao carrinho. Você pode ajustar a quantidade ou remover itens antes de finalizar a compra.",
    },
    {
        number:  "03",
        title: "Confirme o pedido",
        description: "Revise seu carrinho, confira os produtos, quantidades e valores. Complete seus dados e finalize a compra com segurança.",
    },
    {
        number:  "04",
        title: "Entrega rápida",
        description: "Receba seus produtos rapidamente no endereço informado. Acompanhe o status da entrega com o vendedor no WhatsApp e aproveite a experiência de compra completa.",
    }
];

export default function HowItWorks() {
    return (
        <section className="w-full bg-gray-100 py-16 px-4" >
            <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                    <img src={comofunciona} alt="Variedades" className="w-full h-auto rounded-lg shadow-lg" />
                </div>

                <div className="lg:w-1/2">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Como funciona</h2>
                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <div key={index} className="flex items-start gap-5">
                                <div className="text-green-600 text-3xl font-bold">{step.number}</div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-700 ">{step.title}</h3>
                                    <p className="text-gray-600 text-sm">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}