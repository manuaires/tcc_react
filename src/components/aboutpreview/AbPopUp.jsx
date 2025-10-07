import React from "react";

export default function AbPopUp({ open, onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-xl text-center">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Nossa História</h2>
                <p className="text-gray-600 mb-6">
                    Fundada em 2022, nossa empresa nasceu do sonho de oferecer produtos de qualidade e atendimento diferenciado. Ao longo dos anos, conquistamos a confiança de nossos clientes com dedicação, inovação e compromisso com a excelência.
                </p>
                <button
                    onClick={onClose}
                    className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded transition"
                >
                    Fechar
                </button>
            </div>
        </div>
    );
}
   