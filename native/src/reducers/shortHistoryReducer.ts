import produce from 'immer';

import { TypeHistoricalPrices, EntityTypes } from 'apis';
import { Action, ActionTypes } from 'actions';

export interface ShortHistoryReducer {
    currency: TypeHistoricalPrices;
    currencyLoading: boolean;
    currencyError: boolean;

    commodity: TypeHistoricalPrices;
    commodityLoading: boolean;
    commodityError: boolean;

    crypto: TypeHistoricalPrices;
    cryptoLoading: boolean;
    cryptoError: boolean;
};

export const INITIAL_STATE: ShortHistoryReducer = {
    currency: {},
    currencyLoading: false,
    currencyError: false,

    commodity: {},
    commodityLoading: false,
    commodityError: false,

    crypto: {},
    cryptoLoading: false,
    cryptoError: false,
};

export const reducer = (
    state = INITIAL_STATE,
    action: Action
): ShortHistoryReducer => {
    return produce(state, draft => {
        switch(action.type) {
            case ActionTypes.fetchShortTimeCurrency:
                draft.currencyLoading = true;
                draft.currencyError = false;
                break;
            case ActionTypes.fetchShortTimeCurrencySuccess:
                draft.currencyLoading = false;
                draft.currencyError = false;
                draft.currency = action.payload;
                break;
            case ActionTypes.fetchShortTimeCurrencyError:
                draft.currencyLoading = false;
                draft.currencyError = true;
                break;

                
            case ActionTypes.fetchShortTimeCrypto:
                draft.cryptoLoading = true;
                draft.cryptoError = false;
                break;
            case ActionTypes.fetchShortTimeCryptoSuccess:
                draft.cryptoLoading = false;
                draft.cryptoLoading = false;
                draft.crypto = action.payload;
                break;
            case ActionTypes.fetchShortTimeCryptoError:
                draft.cryptoLoading = false;
                draft.cryptoError = true;
                break;

                
            case ActionTypes.fetchShortTimeCommodity:
                draft.commodityLoading = true;
                draft.commodityError = false;
                break;
            case ActionTypes.fetchShortTimeCommoditySuccess:
                draft.commodityLoading = false;
                draft.commodityError = false;
                draft.commodity = action.payload;
                break;
            case ActionTypes.fetchShortTimeCommodityError:
                draft.commodityLoading = false;
                draft.commodityError = true;
                break;
                
            default:
        }
    });
}