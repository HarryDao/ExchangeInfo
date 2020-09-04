import axios from 'axios';

import {
    FINNHUB_REQUEST_ENDPOINTS,
    HISTORICAL_LENGTH_UNIT,
    HISTORICAL_LENGTH,
    HISTORICAL_RESOLUTION,
} from '../../configs';
import { createFinhubUrl } from './url';

import { EntityTypes, TypeCandles, ExchangeEntity } from '../../types';

export class HistoricalPrices {
    fetch = async ({
        symbol,
        type
    }: ExchangeEntity): Promise<TypeCandles> => {
        const url = this.createUrl(symbol, type);
        const { data } = await axios.get<TypeCandles>(url);

        return data;
    }

    private createUrl = (
        symbol: string,
        type: string,
        from?: number,
        to?: number,
        resolution: string = HISTORICAL_RESOLUTION
    ): string => {
        if (!to) {
            to = Math.floor(new Date().getTime() / 1000);
        }
        if (!from) {
            from = to - HISTORICAL_LENGTH * HISTORICAL_LENGTH_UNIT / 1000;
        }

        let endpoint = '';
        if (type === EntityTypes.crypto) {
            endpoint = FINNHUB_REQUEST_ENDPOINTS.crypto
        } else if (
            type === EntityTypes.commodity ||
            type === EntityTypes.currency
        ) {
            endpoint = FINNHUB_REQUEST_ENDPOINTS.forex;
        }

        if (!endpoint) {
            throw new Error(`Invalid entity type: ${type}`);
        }

        const path = `${endpoint}?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`;

        return createFinhubUrl(path);
    }
}