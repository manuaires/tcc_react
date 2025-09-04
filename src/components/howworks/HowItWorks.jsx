import variedades from "../../assets/variedades.png";

const steps = [
    {
        number:  "01",
        title: "Choose Your Product",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
        number:  "02",
        title: "Add to Cart",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
        number:  "03",
        title: "Secure Checkout",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
        number:  "04",
        title: "Fast Delivery",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    }
];

export default function HowItWorks() {
    return (
        <section className="w-full bg-gray-100 py-16 px-4" >
            <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="lg:w-1/2">
                    <img src={variedades} alt="Variedades" className="w-full h-auto rounded-lg shadow-lg" />
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