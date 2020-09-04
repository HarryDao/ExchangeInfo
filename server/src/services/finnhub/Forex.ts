import axios from 'axios';
import {
    FINNHUB_REQUEST_ENDPOINTS,
    FOREX_CURRENCIES,
    FOREX_COMMODITIES,
} from '../../configs';
import { createFinhubUrl } from './url';

import { AxiosResponse } from 'axios';
import { Symbol, ExchangeEntity, EntityTypes } from '../../types';

interface ConvertedSymbolData {
    [key: string]: Symbol
};

export class Forex {
    private static instance: Forex;
    static getInstance(): Forex {
        if (!Forex.instance) Forex.instance = new Forex();
        return Forex.instance;
    }

    private fetching: Promise<void> | null = null;
    private fetched: boolean = false;

    private symbols: ConvertedSymbolData = {};
    currencies: {[key: string]: ExchangeEntity} = {};
    commodities: { [key: string]: ExchangeEntity } = {};
    
    fetchSymbols = (): Promise<void> => {
        if (this.fetched) {
            return new Promise(resolve => resolve());
        }

        if (!this.fetching) {
            this.fetching = this.fetch();
        }

        return this.fetching;
    }
    
    private fetch = async () => {
        try {
            const response = await axios.get<any, AxiosResponse<Symbol[]>>(
                createFinhubUrl(FINNHUB_REQUEST_ENDPOINTS.forexSymbols)
            );
            this.convertSymbols(response.data);
            this.mapCurrencies();
            this.mapCommodities();
            this.fetched = true;
        } catch(error) {
            console.error('Forex error:', error);
        }
    }

    private convertSymbols = (data: Symbol[]) => {
        this.symbols = data.reduce((map: ConvertedSymbolData, d) => {
            map[d.displaySymbol] = d;
            return map;
        }, {});
    }

    private mapCurrencies = () => {
        const { length } = FOREX_CURRENCIES;

        for (let firstIndex = 0; firstIndex < length; firstIndex ++) {
            const first = FOREX_CURRENCIES[firstIndex];

            for (let secondIndex = firstIndex + 1; secondIndex < length; secondIndex ++) {
                const second = FOREX_CURRENCIES[secondIndex];
                const forward = `${first}/${second}`;
                const backward = `${second}/${first}`;

                if (
                    this.symbols[forward] ||
                    this.symbols[backward]
                ) {
                    const name = this.symbols[forward] ? forward : backward;
                    const symbol = this.symbols[name].symbol;

                    this.currencies[symbol] = {
                        type: EntityTypes.currency,
                        symbol,
                        name
                    };
                }
            }
        }
    } 
    
    private mapCommodities = () => {
        const names = Object.keys(FOREX_COMMODITIES) as Array<
            keyof typeof FOREX_COMMODITIES
        >;
        
        names.forEach(name => {
            const displaySymbol = FOREX_COMMODITIES[name];
            if (this.symbols[displaySymbol]) {
                const { symbol } = this.symbols[displaySymbol];
                this.commodities[symbol] = {
                    type: EntityTypes.commodity,
                    symbol,
                    name,
                }
            }
        });
    }
}