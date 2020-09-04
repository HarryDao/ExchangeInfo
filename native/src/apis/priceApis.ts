import axios from 'axios';
import { SERVER_URL, REQUEST_ENDPOINTS } from 'configs';
import {  } from 'helpers';

import { TypePrice } from './types';

export const fetchCurrentPrices = async (): Promise<TypePrice[]> => {
    const url = `${SERVER_URL}/${REQUEST_ENDPOINTS.currentData}`;
    const { data } = await axios.get<TypePrice[]>(url);
    return data;
};