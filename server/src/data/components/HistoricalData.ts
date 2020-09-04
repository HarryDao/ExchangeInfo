import { HistoricalPrices } from '../../services/finnhub';
import {
    HISTORICAL_PRICES_EXPIRY,
    HISTORICAL_FETCH_BUFFER_TIME,
    HISTORICAL_FETCH_SUCCESS_STATUS,
    HISTORICAL_SHORT_LENGTH
} from '../../configs';

import {
    TypeCandles,
    TypeCandle,
    TypeHistoricalPrices,
    TypeHistoricalPricesResponse,
    ExchangeEntity,
    EntityTypes,
} from '../../types';

export class HistoricalData {
    private static instance: HistoricalData;
    static getInstance(): HistoricalData {
        if(!HistoricalData.instance) {
            HistoricalData.instance = new HistoricalData();
        }
        return HistoricalData.instance;
    }

    private historicalPrices = new HistoricalPrices();
    private data: TypeHistoricalPrices = {};
    private symbols: { [symbol: string]: ExchangeEntity } = {};
    private fetchDataInterval?: NodeJS.Timeout;

    subscribeSymbols = async (...entities: ExchangeEntity[]) => {
        this.symbols = entities.reduce((
            map: { [symbol: string]: ExchangeEntity },
            entity
        ) => {
            map[entity.symbol] = entity;
            return map;
        }, {});

        console.log('Historical symbols subcribe:', this.symbols);

        this.initFetchDataInterval();
    }

    private initFetchDataInterval = () => {
        if (this.fetchDataInterval) {
            clearInterval(this.fetchDataInterval)
        }
        this.fetchDataInterval = setInterval(
            this.startGettingData,
            HISTORICAL_PRICES_EXPIRY / 2
        );

        this.startGettingData();
    }

    getData = (
        entities: ExchangeEntity[],
        isShortTime = false
    ): TypeHistoricalPricesResponse => {
        const result: TypeHistoricalPricesResponse = {};

        entities.forEach(entity => {
            if (this.data[entity.symbol]) {
                let { prices } = this.data[entity.symbol];
                if (isShortTime) {
                    prices = this.trimPrices(prices);
                }

                result[entity.symbol] = {
                    ...entity,
                    prices, 
                }
            }
        });

        return result;
    }

    private trimPrices = (prices: TypeCandle[]): TypeCandle[] => {
        return prices.slice(0, HISTORICAL_SHORT_LENGTH);
    }

    private startGettingData = async () => {
        const symbols = Object.keys(this.symbols);
        const retries: string[] = [];
        
        for (const symbol of symbols) {
            const minExceptedTime = new Date().getTime() - HISTORICAL_PRICES_EXPIRY;

            if (
                this.data[symbol] &&
                this.data[symbol].time >= minExceptedTime
            ) continue;
            
            const success = await this.get(symbol);
            if (!success) retries.push(symbol);
        }

        for (const symbol of retries) {
            await this.get(symbol, true);
        }

        console.log('Interval Historical Data Fetching completed');
    }

    private get = async (
        symbol: string,
        isRetry = false
    ): Promise<boolean>=> {
        console.log('Fetch historical price:', symbol);
        let success: boolean;
        const timer = this.setTimer();
        
        try {
            const prices = await this.historicalPrices.fetch(
                this.symbols[symbol]
            );
            
            success = prices.s === HISTORICAL_FETCH_SUCCESS_STATUS;

            if (success) {
                this.data[symbol] = {
                    prices: this.rearrangePrices(prices),
                    time: new Date().getTime()
                };
            }
        } catch(error) {
            console.error(
                `${isRetry ? 'Retry ' : ''}Fetch historical error for ${symbol}:`,
                error
            );
            success = false;
        }
        
        return new Promise<boolean>(resolve => setTimeout(() => {
            resolve(success);
        }, timer()));
    }

    private setTimer = () => {
        const start = new Date().getTime();

        return (): number => {
            const timePassed = new Date().getTime() - start;
            const timeLeft = HISTORICAL_FETCH_BUFFER_TIME - timePassed;
            return Math.max(timeLeft, 0);
        }
    }

    private rearrangePrices = (prices: TypeCandles): TypeCandle[] => {
        const { c, o, h, l, t, v } = prices;
        const { length } = c;
        const rearranged: TypeCandle[] = [];

        for (let i = 0; i < length; i++) {
            rearranged.push({
                c: c[i],
                o: o[i],
                h: h[i],
                l: l[i],
                t: t[i],
                v: v[i]
            });
        }

        rearranged.sort((a, b) => {
            return a.t < b.t ? 1 : -1;
        });

        return rearranged;
    }
}