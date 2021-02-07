import openSocketIO from 'socket.io-client';
import { SOCKET_URL } from 'configs';
import {
    socketIsReady,
    socketIsDisconnected,
    newPricesArrived,
} from 'actions';

import { Dispatch } from 'redux';
import { SocketEvents } from './types';
import { TypePrice } from 'apis';

export class SocketIO {
    private static instance: SocketIO;
    private static initializing: Promise<SocketIO>;

    static getInstance(dispatch?: Dispatch): Promise<SocketIO> {
        if (SocketIO.instance) {
            return new Promise(resolve => resolve(SocketIO.instance));
        }

        if (SocketIO.initializing) {
            return SocketIO.initializing;
        }

        SocketIO.initializing = new Promise(resolve => {
            const socketIO = new SocketIO();          
            if (dispatch) {
                socketIO.attachDispatch(dispatch);
            }

            socketIO.init()
                .then(() => {
                    SocketIO.instance = socketIO;
                    resolve(SocketIO.instance);
                })
                .catch(error => {
                    console.warn('SocketIO init error:', error);
                });
        });

        return SocketIO.initializing;
    }

    private socket?: SocketIOClient.Socket;
    private dispatch?: Dispatch;

    init = (): Promise<SocketIOClient.Socket> => {
        return new Promise(resolve => {
            if (this.socket) {
                return resolve(this.socket);
            }
            console.log('connecting:', SOCKET_URL.host, SOCKET_URL.path);
            const socket = openSocketIO(SOCKET_URL.host, {
                path: SOCKET_URL.path
            });

            socket.on(SocketEvents.connect, () => {
                console.log('connected');
                this.socket = socket;
                this.isReady();
                resolve(socket);
            });

            socket.on(SocketEvents.disconnect, this.isDisconnected);
            socket.on(SocketEvents.newData, this.onNewData);
        })
    }

    attachDispatch = (dispatch: Dispatch) => {
        this.dispatch = dispatch;
    }

    private isReady = () => {
        // setTimeout(() => {
            if (this.dispatch && this.socket) {
                this.dispatch(socketIsReady());
            }
        // }, 5000);
    }

    private isDisconnected = () => {
        if (this.dispatch) {
            this.dispatch(socketIsDisconnected());
        }
    }

    private onNewData = (data: TypePrice[]) => {
        if (this.dispatch) {
            this.dispatch(newPricesArrived(data));
        }
    }
}