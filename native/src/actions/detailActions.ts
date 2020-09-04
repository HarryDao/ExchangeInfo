import { ActionTypes } from './types';
import { TypeHistoricalPrices, TypeExchangeEntity } from 'apis';

// fetch

export interface FetchDetail {
    type: ActionTypes.fetchDetail,
    payload: TypeExchangeEntity
};

export const fetchDetail = (entity: TypeExchangeEntity): FetchDetail => ({
    type: ActionTypes.fetchDetail,
    payload: entity
});

// success

export interface FetchDetailSuccess {
    type: ActionTypes.fetchDetailSuccess,
    payload: TypeHistoricalPrices
}

export const fetchDetailSuccess = (data: TypeHistoricalPrices): FetchDetailSuccess => {
    return {
        type: ActionTypes.fetchDetailSuccess,
        payload: data,
    };
};

// error

export interface FetchDetailError {
    type: ActionTypes.fetchDetailError
}

export const fetchDetailError = (): FetchDetailError => ({
    type: ActionTypes.fetchDetailError
})