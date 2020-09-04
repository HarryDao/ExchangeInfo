import produce from 'immer';

import { ActionTypes, Action } from 'actions';
import { EntityTypes, TypePrices } from 'apis';


export interface PriceReducer {
    [EntityTypes.commodity]: TypePrices;
    [EntityTypes.crypto]: TypePrices;
    [EntityTypes.currency]: TypePrices;
    loading: boolean;
    error: false;
}

export const INITIAL_STATE: PriceReducer = {
    [EntityTypes.currency]: {},
    [EntityTypes.crypto]: {},
    [EntityTypes.commodity]: {},
    loading: false,
    error: false
}

export const reducer = (state = INITIAL_STATE, action: Action): PriceReducer => {
    return produce(state, draft => {
        switch (action.type) {
            case ActionTypes.fetchPrices:
                draft.loading = true;
                draft.error = false;
                break;
            case ActionTypes.fetchPricesSuccess:
                draft.loading = false;
                draft.error = false;
                [
                    EntityTypes.commodity,
                    EntityTypes.crypto,
                    EntityTypes.currency
                ].forEach(type => {
                    draft[type] = Object.assign(
                        action.payload[type],
                        draft[type]
                    )
                });
                break;
            case ActionTypes.newPricesArrived:
                action.payload.forEach(price => {
                    draft[price.type][price.s] = price;
                });
                break;
            default:
        }
    });
};

