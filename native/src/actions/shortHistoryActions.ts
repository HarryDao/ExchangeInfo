import { ActionTypes } from './types';
import { TypeHistoricalPrices } from 'apis';

// CURRENCY

// fetch currency

export interface FetchShortTimeCurrency {
    type: ActionTypes.fetchShortTimeCurrency
}

export const fetchShortTimeCurrency = (): FetchShortTimeCurrency => {
    return {
        type: ActionTypes.fetchShortTimeCurrency
    }
};

// fetch currency success

export interface FetchShortTimeCurrencySuccess {
    type: ActionTypes.fetchShortTimeCurrencySuccess,
    payload: TypeHistoricalPrices
}

export const fetchShortTimeCurrencySuccess = (
    data: TypeHistoricalPrices
): FetchShortTimeCurrencySuccess => ({
    type: ActionTypes.fetchShortTimeCurrencySuccess,
    payload: data
});

// fetch currency error

export interface FetchShortTimeCurrencyError {
    type: ActionTypes.fetchShortTimeCurrencyError
};

export const fetchShortTimeCurrencyError = (): FetchShortTimeCurrencyError => ({
    type: ActionTypes.fetchShortTimeCurrencyError
});


// CRYPTO

// fetch crypto

export interface FetchShortTimeCrypto {
    type: ActionTypes.fetchShortTimeCrypto
}

export const fetchShortTimeCrypto = (): FetchShortTimeCrypto => {
    return {
        type: ActionTypes.fetchShortTimeCrypto
    }
};

// fetch crypto success

export interface FetchShortTimeCryptoSuccess {
    type: ActionTypes.fetchShortTimeCryptoSuccess,
    payload: TypeHistoricalPrices
}

export const fetchShortTimeCryptoSuccess = (
    data: TypeHistoricalPrices
): FetchShortTimeCryptoSuccess => ({
    type: ActionTypes.fetchShortTimeCryptoSuccess,
    payload: data
});

// fetch crypto error

export interface FetchShortTimeCryptoError {
    type: ActionTypes.fetchShortTimeCryptoError
};

export const fetchShortTimeCryptoError = (): FetchShortTimeCryptoError => ({
    type: ActionTypes.fetchShortTimeCryptoError
});


// COMMODITY

// fetch commodity

export interface FetchShortTimeCommodity {
    type: ActionTypes.fetchShortTimeCommodity
}

export const fetchShortTimeCommodity = (): FetchShortTimeCommodity => {
    return {
        type: ActionTypes.fetchShortTimeCommodity
    }
};

// fetch commodity success

export interface FetchShortTimeCommoditySuccess {
    type: ActionTypes.fetchShortTimeCommoditySuccess,
    payload: TypeHistoricalPrices
}

export const fetchShortTimeCommoditySuccess = (
    data: TypeHistoricalPrices
): FetchShortTimeCommoditySuccess => ({
    type: ActionTypes.fetchShortTimeCommoditySuccess,
    payload: data
});

// fetch commodity error

export interface FetchShortTimeCommodityError {
    type: ActionTypes.fetchShortTimeCommodityError
};

export const fetchShortTimeCommodityError = (): FetchShortTimeCommodityError => ({
    type: ActionTypes.fetchShortTimeCommodityError
});