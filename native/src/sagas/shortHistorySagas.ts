import { all, takeEvery, call, put } from 'redux-saga/effects';
import { fetchShortTimeHistoricalPrices } from 'apis';
import {
    fetchShortTimeCurrencySuccess,
    fetchShortTimeCurrencyError,
    fetchShortTimeCryptoSuccess,
    fetchShortTimeCryptoError,
    fetchShortTimeCommoditySuccess,
    fetchShortTimeCommodityError,
} from 'actions';

import { ActionTypes } from 'actions';
import { EntityTypes, TypeHistoricalPrices } from 'apis';

export const sagas = function* () {
    yield all([
        takeEvery(
            ActionTypes.fetchShortTimeCurrency,
            fetchShortTimeCurrency
        ),
        takeEvery(
            ActionTypes.fetchShortTimeCrypto,
            fetchShortTimeCrypto
        ),
        takeEvery(
            ActionTypes.fetchShortTimeCommodity,
            fetchShortTimeCommodity
        )
    ]);
}

function* fetchShortTimeCurrency() {
    try {
        const data: TypeHistoricalPrices = yield call(
            fetchShortTimeHistoricalPrices,
            EntityTypes.currency
        );

        yield put(fetchShortTimeCurrencySuccess(data));

    } catch(error) {
        console.warn('fetchShortTimeCurrency error:', error);
        yield put(fetchShortTimeCurrencyError());
    }
}

function* fetchShortTimeCrypto() {
    try {
        const data: TypeHistoricalPrices = yield call(
            fetchShortTimeHistoricalPrices,
            EntityTypes.crypto
        );

        yield put(fetchShortTimeCryptoSuccess(data));

    } catch(error) {
        console.warn('fetchShortTimeCurrency error:', error);
        yield put(fetchShortTimeCryptoError());
    }
}

function* fetchShortTimeCommodity() {
    try {
        const data: TypeHistoricalPrices = yield call(
            fetchShortTimeHistoricalPrices,
            EntityTypes.commodity
        );

        yield put(fetchShortTimeCommoditySuccess(data));

    } catch(error) {
        console.warn('fetchShortTimeCommodity error:', error);
        yield put(fetchShortTimeCommodityError());
    }
}
