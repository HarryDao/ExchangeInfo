export enum EntityTypes {
    currency = 'currency',
    commodity = 'commodity',
    crypto = 'crypto',
}

export interface ExchangeEntity {
    type: EntityTypes;
    symbol: string;
    name: string;
}

export interface Symbol {
    description: string;
    displaySymbol: string;
    symbol: string;
}

export interface RawData {
    s: string;
    t: number;
    v: number;
    p: number;
};

export interface TradeData {
    data: RawData[],
    type: 'trade';
}

export interface TypeData extends RawData {
    type: EntityTypes,
    name: string;
}

export type DataCallback = (data: TypeData) => any;

export interface TypeCandles {
    c: number[],
    h: number[],
    l: number[],
    o: number[],
    s: string,
    t: number[],
    v: number[],
}

export interface TypeCandle {
    c: number;
    o: number;
    h: number;
    l: number;
    t: number;
    v: number;
}

export interface TypeHistoricalPrices {
    [symbol: string]: {
        prices: TypeCandle[];
        time: number;
    }
}

export interface TypeHistoricalPricesResponse {
    [symbol: string]: {
        prices: TypeCandle[];
        type: EntityTypes;
        symbol: string;
        name: string;
    }
}
