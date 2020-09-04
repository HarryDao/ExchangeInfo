import axios from 'axios';

import { FINNHUB_REQUEST_ENDPOINTS, CRYPTOS } from '../../configs';
import { createFinhubUrl } from './url';

import { AxiosResponse } from 'axios';
import { Symbol, ExchangeEntity, EntityTypes } from '../../types';

interface ConvertedData {
    [displaySymbol: string]: Symbol
}

export class Crypto {
    private static instance: Crypto;
    static getInstance() {
        if (!Crypto.instance) Crypto.instance = new Crypto();
        return Crypto.instance;
    }

    private symbols: ConvertedData  = {};
    cryptos: { [symbol: string]: ExchangeEntity } = {};

    fetchSymbols = async () => {
        try {
            const response = await axios.get<any, AxiosResponse<Symbol[]>>(
                createFinhubUrl(FINNHUB_REQUEST_ENDPOINTS.cryptoSymbols)
            );
    
            this.convertData(response.data);
            this.mapCryptos();
        } catch(error) {
            console.error('Crypto fetch symbols error:', error);
        }
    }

    private convertData = (data: Symbol[]): void => {
        this.symbols = data.reduce((map: ConvertedData, symbol) => {
            map[symbol.displaySymbol] = symbol;
            return map;
        }, {});
    }

    private mapCryptos = () => {
        const names = Object.keys(CRYPTOS) as Array<keyof typeof CRYPTOS>;
        names.forEach(name => {
            const displaySymbol = CRYPTOS[name];
            if (this.symbols[displaySymbol]) {
                const symbol = this.symbols[displaySymbol].symbol;
                this.cryptos[symbol] = {
                    type: EntityTypes.crypto,
                    symbol,
                    name
                }
            }
        });
    }
}