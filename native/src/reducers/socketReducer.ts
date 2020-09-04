import produce from 'immer';
import { ActionTypes, Action } from 'actions';

export type SocketReducer = {
    isReady: boolean;
}

export const INITIAL_STATE: SocketReducer = {
    isReady: false
}

export const reducer = (state = INITIAL_STATE, action: Action): SocketReducer => {
    return produce(state, draft => {
        switch(action.type) {
            case ActionTypes.socketIsReady:
                draft.isReady = true;
                break;
            case ActionTypes.socketIsDisconnected:
                draft.isReady = false;
                break;
            default:
        }
    })
};