"use client";

import { useState } from "react";
import { Liquido, EntradaSimulador } from "../../types";
import { calcularPressao } from "../../utils/calculoPressao";
import { Resultado } from "./resultado";

const liquidosPadrao = [
    { nome: "Água", densidade: 1000 },
    { nome: "Óleo", densidade: 850 },
    { nome: "Mercúrio", densidade: 13500 },
    { nome: "Glicerina", densidade: 1260 },
    { nome: "Etanol", densidade: 789 },
    
];



const coresLiquidos: Record<string, string> = {
  Água: "#3b82f6",
  Óleo: "#fde047",
  Mercúrio: "#d1d5db",
  Glicerina: "#9333ea",
  Etanol: "#16a34a",
};

 export function RecipienteVisual({ liquidos }: { liquidos: Liquido[] }) {
  const [animar, setAnimar] = useState<boolean[]>([]);

  useEffect(() => {
    setAnimar(liquidos.map(() => false));
    liquidos.forEach((_, i) => {
      setTimeout(() => {
        setAnimar((old) => {
          const copia = [...old];
          copia[i] = true;
          return copia;
        });
      }, i * 300);
    });
  }, [liquidos]);

  const liquidosOrdenados = liquidos
    .map((liq, index) => ({ ...liq, indexOriginal: index }))
    .sort((a, b) => b.densidade - a.densidade);

  return (
    <>
      <style>{`
        @keyframes cair {
          0% { height: 0; }
          100% { height: var(--altura-final); }
        }
      `}</style>

      <div className="mt-6">
        <h2 className="font-bold mb-2">Recipiente com líquidos</h2>
        <div className="w-48 h-[500px] border-4 border-gray-700 rounded overflow-hidden flex flex-col-reverse">
          {liquidosOrdenados.map((liq, i) => {
            const alturaPx = Math.max(10, liq.altura * 80);
            return (
              <div
                key={i}
                className="text-xs text-center text-white flex items-center justify-center"
                style={{
                  backgroundColor: coresLiquidos[liq.nome] || "#6b7280",
                  height: animar[liq.indexOriginal] ? `${alturaPx}px` : "0px",
                  borderTop: "1px solid #000",
                  animation: animar[liq.indexOriginal] ? `cair 0.6s ease forwards` : "none",
                  "--altura-final": `${alturaPx}px`,
                  overflow: "hidden",
                } as React.CSSProperties}
              >
                {animar[liq.indexOriginal] && `${liq.nome} (${liq.altura}m)`}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function InputForm() {
    const [liquidos, setLiquidos] = useState<Liquido[]>([]);
    const [incluirPressaoAtmosferica, setIncluir] = useState(true);
    const [resultado, setResultado] = useState<{ pressaoTotal: number; detalhes: string[] } | null>(null);

    const adicionarLiquido = () => {
        setLiquidos([...liquidos, { nome: "Água", densidade: 1000, altura: 0 }]);
    };
   
  type AtualizarLiquidoKey = keyof Liquido;

const atualizarLiquido = (
  index: number,
  key: AtualizarLiquidoKey,
  valor: string | number
) => {
  const copia = [...liquidos];

  if (key === "densidade" || key === "altura") {
    copia[index][key] = parseFloat(valor as string) as number;
  } else {
    copia[index][key] = valor as string;
  }

  setLiquidos(copia);
};

    const calcular = () => {

        const dadosValidos = liquidos.every(l => l.nome && l.densidade > 0 && l.altura >= 0)

        if (!dadosValidos) {
            alert("Priencha todos os campos antes de calcular!")
        }

        const entrada: EntradaSimulador = { liquidos, incluirPressaoAtmosferica };
        const resultado = calcularPressao(entrada);

        setResultado(resultado);
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Simulador de Pressão Hidrostática</h1>

            {liquidos.map((l, i) => (
                <div key={i} className="mb-2 p-2 border rounded flex  flex-col gap-4">
                    <select value={l.nome} onChange={(e) => atualizarLiquido(i, "nome", e.target.value)}>
                        <option className="bg-zinc-500" value="">Selecione o líquido</option>
                        {liquidosPadrao.map((op) => (
                            <option className="bg-zinc-700" key={op.nome} value={op.nome}>{op.nome}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Densidade (kg/m³)"
                        value={l.densidade}
                        onChange={(e) => atualizarLiquido(i, "densidade", e.target.value)}
                        className="ml-2"
                    />
                    <input
                        type="number"
                        placeholder="Altura (m)"
                        value={l.altura}
                        onChange={(e) => atualizarLiquido(i, "altura", e.target.value)}
                        className="ml-2"
                    />
                </div>
            ))}

            <button onClick={adicionarLiquido} className="bg-blue-500 text-white px-4 py-1 rounded mt-2">Adicionar líquido</button>

            <div className="my-4">
                <label>
                    <input type="checkbox" checked={incluirPressaoAtmosferica} onChange={(e) => setIncluir(e.target.checked)} />
                    Incluir pressão atmosférica?
                </label>
            </div>

            <button onClick={calcular} className="bg-green-500 text-white px-4 py-1 rounded">Calcular Pressão</button>

            {resultado && <Resultado resultado={resultado} />}
        </div>
    );
}
