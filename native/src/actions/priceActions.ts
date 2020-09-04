import { mapPrices } from 'helpers';

import { ActionTypes } from './types';
import { TypePrice, MappedPrices } from 'apis';

// fetching
export interface FetchPrices {
    type: ActionTypes.fetchPrices
};

export const fetchPrices = (): FetchPrices => ({
    type: ActionTypes.fetchPrices
});

// fetched

export interface FetchPricesSuccess {
    type: ActionTypes.fetchPricesSuccess,
    payload: MappedPrices
};

export const fetchPricesSuccess = (data: TypePrice[]): FetchPricesSuccess => ({
    type: ActionTypes.fetchPricesSuccess,
    payload: mapPrices(data)
});

// fetch failed

export interface FetchPricesFailed {
    type: ActionTypes.fetchPricesFailed
}

export const fetchPricesFailed = () => ({
    type: ActionTypes.fetchPricesFailed
});

// New Prices Arrived

export interface NewPricesArrived {
    type: ActionTypes.newPricesArrived,
    payload: TypePrice[]
}

export const newPricesArrived = (data: TypePrice[]): NewPricesArrived => ({
    type: ActionTypes.newPricesArrived,
    payload: data
})