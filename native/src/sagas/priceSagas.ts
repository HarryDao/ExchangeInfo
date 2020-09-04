import { all, takeEvery, call, put, delay } from 'redux-saga/effects';
import { fetchPricesSuccess, fetchPricesFailed } from 'actions';
import { fetchCurrentPrices } from 'apis';
import { setAPITimer } from 'helpers';

import { ActionTypes } from 'actions';
import { TypePrice } from 'apis';

export const sagas = function* () {
    yield all([
        takeEvery(
            ActionTypes.fetchPrices,
            fetchPrices
        )
    ]);
}

function* fetchPrices() {
    const timer: () => number = yield call(setAPITimer);
    try {
        const data: TypePrice[] = yield call(fetchCurrentPrices);

        yield delay(timer());

        yield put(fetchPricesSuccess(data));
    } catch(error) {
        console.warn('Saga fetchPrices error', error);
        yield delay(timer());
        yield put(fetchPricesFailed());
    }
}