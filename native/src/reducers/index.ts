import { combineReducers } from 'redux';
import {
    reducer as socket,
    INITIAL_STATE as socketState,
    SocketReducer
} from './socketReducer';
import {
    reducer as price,
    INITIAL_STATE as priceState,
    PriceReducer,
} from './priceReducer';
import {
    reducer as shortHistory,
    INITIAL_STATE as shortHistoryState,
    ShortHistoryReducer,
} from './shortHistoryReducer';
import {
    reducer as detail,
    INITIAL_STATE as detailState,
    DetailReducer,
} from './detailReducer';


export type StoreState = {
    socket: SocketReducer,
    price: PriceReducer,
    shortHistory: ShortHistoryReducer,
    detail: DetailReducer
}

export const INITIAL_STATE: StoreState = {
    socket: socketState,
    price: priceState,
    shortHistory: shortHistoryState,
    detail: detailState,
};

export const reducers = combineReducers({
    socket,
    price,
    shortHistory,
    detail
});