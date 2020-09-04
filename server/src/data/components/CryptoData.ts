import { Crypto } from '../../services/finnhub';

import { TypeData } from '../../types';

export class CryptoData {
    private static instance: CryptoData;
    static getInstance(): CryptoData {
        if (!CryptoData.instance) CryptoData.instance = new CryptoData();
        return CryptoData.instance;
    }

    private crypto = Crypto.getInstance();
    private data: {[ symbol: string ]: TypeData} = {};
    
    fetchSymbols = this.crypto.fetchSymbols;

    getSymbols = () => this.crypto.cryptos;

    onNewData = (newData: TypeData) => {
        this.data[newData.s] = newData;
    }

    getData = (): TypeData[] => {
        return Object.values(this.data);
    }
}