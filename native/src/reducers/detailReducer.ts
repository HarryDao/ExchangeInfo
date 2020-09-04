import produce from 'immer';

import { ActionTypes, Action } from 'actions';
import { TypeHistoricalPrices, EntityTypes, TypeExchangeEntity } from 'apis';

export interface DetailReducer extends TypeExchangeEntity {
    data: TypeHistoricalPrices 
    loading: boolean;
    error: boolean;
}

export const INITIAL_STATE: DetailReducer = {
    data: {},
    loading: false,
    error: false,
    type: EntityTypes.currency,
    symbol: '',
    name: '',
}

export const reducer = (state = INITIAL_STATE, action: Action) => {
    return produce(state, draft => {
        switch(action.type) {
            case ActionTypes.fetchDetail:
                draft.type = action.payload.type;
                draft.symbol = action.payload.symbol;
                draft.name = action.payload.name;
                draft.loading = true;
                draft.error = false;
                break;
            case ActionTypes.fetchDetailSuccess:
                const symbols = Object.keys(action.payload);
                draft.loading = false;
                draft.error = !symbols.includes(draft.symbol);
                symbols.forEach(symbol => {
                    draft.data[symbol] = action.payload[symbol];
                });
                break;
            case ActionTypes.fetchDetailError:
                draft.loading = false;
                draft.error = true;

            default:
        }
    });
}