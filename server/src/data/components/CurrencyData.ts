import { Forex } from '../../services/finnhub';

import { TypeData } from '../../types';

export class CurrencyData {
    private static instance: CurrencyData;
    static getInstance(): CurrencyData {
        if (!CurrencyData.instance) {
            CurrencyData.instance = new CurrencyData();
        }

        return CurrencyData.instance;
    }

    private forex = Forex.getInstance();
    private data: { [symbol: string]: TypeData } = {};

    fetchSymbols = this.forex.fetchSymbols;

    getSymbols = () => this.forex.currencies;

    onNewData = (newData: TypeData) => {
        this.data[newData.s] = newData;
    }

    getData = (): TypeData[] => {
        return Object.values(this.data);
    }
}