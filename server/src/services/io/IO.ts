import http from 'http';
import socketIO from 'socket.io';

import { SIGNAL_NEW_DATA_INTERVAL } from '../../configs';

import { SocketEvents } from './types';

export class IO {
    private static instance: IO;
    static getInstance(server?: http.Server) {
        if (!IO.instance && server) IO.instance = new IO(server);
        return IO.instance;
    }

    private io: SocketIO.Server;
    private newData: {[symbol: string]: any} = {};

    constructor(server: http.Server) {
        this.io = socketIO(server);
        this.io.on(
            SocketEvents.newConnection,
            this.onNewConnection
        );
        this.initSignalNewDataLoop();
    }

    private initSignalNewDataLoop = () => {
        setInterval(() => {
            const newData = Object.values(this.newData);
            this.newData = {};

            if (newData.length) {
                // console.log('emit new Data:', newData.length);
                this.io.sockets.emit(
                    SocketEvents.newData, newData
                );
            }
        }, SIGNAL_NEW_DATA_INTERVAL || 1000);
    }

    private onNewConnection = (socket: SocketIO.Socket) => {}

    addNewData = (symbol: string, data: any) => {
        // console.log('new:', data.type);
        this.newData[symbol] = data;
    }
}