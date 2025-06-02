import { EntradaSimulador } from "../types";

const GRAVIDADE = 9.8; //
const PRESSAO_ATMOSFERICA = 101325; // 

export function calcularPressao({ liquidos, incluirPressaoAtmosferica }: EntradaSimulador) {
    const detalhes: string[] = [];
    let pressaoTotal = incluirPressaoAtmosferica ? PRESSAO_ATMOSFERICA : 0;

    if (incluirPressaoAtmosferica) {
        detalhes.push(`P0 = ${PRESSAO_ATMOSFERICA} Pa (pressão atmosférica incluída)`);
    } else {
        detalhes.push("Pressão atmosférica não incluída (cálculo manométrico)");
    }

    liquidos.forEach((l, index) => {
        const contribuicao = l.densidade * GRAVIDADE * l.altura;
        pressaoTotal += contribuicao;
        detalhes.push(
            `Camada ${index + 1} (${l.nome}): P = ${l.densidade} * ${GRAVIDADE} * ${l.altura} = ${contribuicao.toFixed(2)} Pa`
        );
    });

    detalhes.push(` Pressão final: ${pressaoTotal.toFixed(2)} Pa`);
    return { pressaoTotal, detalhes };
}
