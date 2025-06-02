
type ResultadoProps = {
    resultado: { pressaoTotal: number; detalhes: string[] };

}

export function Resultado({ resultado }: ResultadoProps) {
    return (
        <>
            <div className="mt-6 p-4 bg-gray-500 rounded shadow">
                <h2 className="font-bold mb-2">Resultado</h2>
                <ul className="list-disc list-inside">
                    {resultado.detalhes.map((d, i) => (
                        <li key={i}>{d}</li>
                    ))}
                </ul>
                <p className="mt-4 font-bold">Pressão total: {resultado.pressaoTotal.toFixed(2)} Pa</p>
            </div>
        </>
    )
}