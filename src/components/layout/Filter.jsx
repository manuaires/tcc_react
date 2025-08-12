import React, { useState } from "react";

// Exemplo de uso:
// <Filter
//   options={[{ label: "Categoria 1", value: "cat1" }, ...]}
//   products={[{ id: 1, name: "Produto", category: "cat1" }, ...]}
//   filterKey="category"
//   onFilter={filteredProducts => setProdutosFiltrados(filteredProducts)}
// />

const Filter = ({ options = [], products = [], filterKey = "", onFilter }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState([]);

    const handleSelect = (value) => {
        let updated;
        if (selected.includes(value)) {
            updated = selected.filter((v) => v !== value);
        } else {
            updated = [...selected, value];
        }
        setSelected(updated);

        // Filtra os produtos conforme as opções selecionadas
        if (onFilter) {
            if (updated.length === 0) {
                onFilter(products);
            } else {
                onFilter(
                    products.filter((p) => updated.includes(p[filterKey]))
                );
            }
        }
    };

    return (
        <div style={{ width: 250 }}>
            <button
                onClick={() => setOpen((o) => !o)}
                style={{
                    width: "100%",
                    padding: "10px",
                    background: "#f5f5f5",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                }}
            >
                Filtros ▼
            </button>
            {open && (
                <div
                    style={{
                        border: "1px solid #ccc",
                        background: "#fff",
                        padding: "10px",
                        marginTop: 2,
                        borderRadius: 4,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    }}
                >
                    {options.map((opt) => (
                        <label key={opt.value} style={{ display: "block", marginBottom: 8 }}>
                            <input
                                type="checkbox"
                                checked={selected.includes(opt.value)}
                                onChange={() => handleSelect(opt.value)}
                            />
                            {" "}{opt.label}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Filter;