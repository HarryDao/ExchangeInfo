import { all } from 'redux-saga/effects';
import { sagas as priceSagas } from './priceSagas';
import { sagas as shortHistorySagas } from './shortHistorySagas';
import { sagas as detailSagas } from './detailSagas';

export const sagas = function* () {
    yield all([
        priceSagas(),
        shortHistorySagas(),
        detailSagas(),
    ]);
}