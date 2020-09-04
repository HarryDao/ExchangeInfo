import axios from 'axios';
import { SERVER_URL, REQUEST_ENDPOINTS } from 'configs';

import { EntityTypes, TypeHistoricalPrices } from './types';

export const fetchShortTimeHistoricalPrices = async (
    type: EntityTypes
): Promise<TypeHistoricalPrices> => {
    const url = `${SERVER_URL}/${REQUEST_ENDPOINTS.historyShortTime}/${type}`;
    const { data } = await axios.get<TypeHistoricalPrices>(url);
    return data;
}

export const fetchLongTimeHistoricalPrices = async(
    symbol: string
): Promise<TypeHistoricalPrices> => {
    const url = `${SERVER_URL}/${REQUEST_ENDPOINTS.historyLongTime}/${symbol}`;
    const { data } = await axios.get<TypeHistoricalPrices>(url);
    return data;
}