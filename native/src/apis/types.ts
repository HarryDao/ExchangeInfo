export enum EntityTypes {
    currency = 'currency',
    commodity = 'commodity',
    crypto = 'crypto',
}

export interface TypeExchangeEntity {
    type: EntityTypes;
    symbol: string;
    name: string;
}

export type TimeInSeconds = number;

export interface TypePrice {
    name: string;
    type: EntityTypes;
    s: string;
    t: TimeInSeconds;
    v: number;
    p: number;
}

export interface TypePrices {
    [symbol: string]: TypePrice
}

export type MappedPrices = {
    [type in EntityTypes]: TypePrices
}

export interface TypeCandle {
    c: number;
    o: number;
    h: number;
    l: number;
    t: TimeInSeconds;
    v: number;
}

export interface TypeHistoricalPrice {
    prices: TypeCandle[];
    type: EntityTypes;
    symbol: string;
    name: string;
}

export interface TypeHistoricalPrices {
    [symbol: string]: TypeHistoricalPrice
}