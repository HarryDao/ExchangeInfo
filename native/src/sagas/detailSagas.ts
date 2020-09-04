import { all, call, put, takeEvery } from 'redux-saga/effects';
import { fetchLongTimeHistoricalPrices, TypeHistoricalPrices } from 'apis';
import {
    fetchDetailSuccess,
    fetchDetailError
} from 'actions';
import { setAPITimer } from 'helpers';

import { ActionTypes, FetchDetail } from 'actions';
import { TypeExchangeEntity } from 'apis';

export const sagas = function* () {
    yield all([
        takeEvery(
            ActionTypes.fetchDetail,
            fetchDetail
        )
    ]);
}

function* fetchDetail({ payload }: FetchDetail) {
    const timer: () => number = yield call(setAPITimer);
    try {
        const data: TypeHistoricalPrices = yield call(fetchLongTimeHistoricalPrices, payload.symbol);

        yield (new Promise(resolve => setTimeout(resolve, timer())));
        yield put(fetchDetailSuccess(data));
    } catch(error) {
        console.warn('Saga fetchDetail error:', error);
        yield (new Promise(resolve => setTimeout(resolve, timer())));
        yield put(fetchDetailError());
    }
}