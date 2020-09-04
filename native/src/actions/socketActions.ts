import { ActionTypes } from './types';

// Socket Is Ready

export type SocketIsReady = {
    type: ActionTypes.socketIsReady
}

export const socketIsReady = () => ({
    type: ActionTypes.socketIsReady,
});

// Socket is Disconnected

export type SocketIsDisconnected = {
    type: ActionTypes.socketIsDisconnected
}

export const socketIsDisconnected = () => ({
    type: ActionTypes.socketIsDisconnected
});