export interface Liquido {
    nome: string;
    densidade: number;
    altura: number;
}

export interface EntradaSimulador {
    liquidos: Liquido[];
    incluirPressaoAtmosferica: boolean;
}
