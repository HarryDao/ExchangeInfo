import WebSocket from 'ws';
import { FINNHUB_SOCKET_URL, FINNHUB_KEY } from '../../configs';

import {
    ExchangeEntity,
    DataCallback,
    TradeData,
    TypeData
} from '../../types';

const WS_URL = `${FINNHUB_SOCKET_URL}?token=${FINNHUB_KEY.socket}`;

interface WebSocketEvent {
    data: any;
    type: string;
}

export class Live {
    private static instance: Live;
    static getInstance(): Live {
        if (!Live.instance) {
            Live.instance = new Live();
        }

        return Live.instance;
    }

    private socket: WebSocket;
    private waitingSubscribeEntities: ExchangeEntity[] = [];
    private symbols: { [symbol: string]: ExchangeEntity } = {};
    private initialized = false;
    private dataCallbacks: DataCallback[] = [];

    constructor() {
        this.socket = new WebSocket(WS_URL);
        this.init();
    }

    reconnect = () => {
        console.log('reconnect');
        this.socket.removeAllListeners();
        this.socket.close();

        this.initialized = false;
        this.socket = new WebSocket(WS_URL);

        this.init();
    }

    private init = () => {
        console.log('opening');
        this.socket.addEventListener('open', this.onOpen);
        this.socket.addEventListener('message', this.onMessage);
        this.socket.addEventListener('error', this.onError);
    }

    private onOpen = () => {
        console.log('open');
        this.initialized = true;
        this.subscribeSymbols();
        this.waitingSubscribeEntities = [];
    }

    private onMessage = (event: WebSocketEvent): void => {
        if (event.type === 'error') {
            console.error('Live Error:', event);
        } else if (event.type === 'message') {
            this.onData(event.data);
        } else {
            console.log('Live Message exception:', event);
        }
    }

    private onError = (error: any) => {
        console.error('Finnhub Socket error:', error);
    }

    private onData = (dataRaw: string)  => {
        try {
            const response = JSON.parse(dataRaw);

            if (
                !response ||
                response.type !== 'trade' ||
                !response.data
            ) return;

            const { data: rawData } = response as TradeData;
                
            if (
                !rawData[0] ||
                !rawData[0].s ||
                !this.symbols[rawData[0].s]
            ) return;

            const { type, name } = this.symbols[rawData[0].s];
            const data: TypeData = {
                ...rawData[0],
                type,
                name,
            }
            
            this.dataCallbacks.forEach(callback => {
                callback(data);
            });
        } catch(error) {
            console.error('Live read data error:', error);
        }
    }

    private subscribe = async (entity: ExchangeEntity) => {
        return new Promise(resolve => {
            console.log('Live symbol subscribe:', entity);

            this.symbols[entity.symbol] =  entity;

            this.socket.send(JSON.stringify({
                type: 'subscribe',
                symbol: entity.symbol                
            }));

            setTimeout(resolve, 200);
        });
    }

    private subscribeSymbols = async (entities?: ExchangeEntity[]) => {
        entities = entities || this.waitingSubscribeEntities;
        for (const entity of entities) {
            await this.subscribe(entity);
        }
    }

    addSymbols = async (...entities: ExchangeEntity[]) => {
        if (!this.initialized) {
            this.waitingSubscribeEntities.push(...entities);
            return;
        } else {
            await this.subscribeSymbols(entities);
        }
    }

    subscribeNewDataCallback = (fn: DataCallback): void => {
        this.dataCallbacks.push(fn);
    }
}