import { IO } from '../services/io';
import { Live } from '../services/finnhub';
import {
    CryptoData,
    HistoricalData,
    CurrencyData,
    CommodityData,
} from './components';
import {
    EntityTypes,
    ExchangeEntity,
    TypeData,
    TypeHistoricalPricesResponse,
} from '../types';
import { FINNHUB_SOCKET_WAIT_TIME_BEFORE_RESET } from '../configs';

export class ExchangeData {
    private static instance: ExchangeData;
    static getInstance(): ExchangeData {
        if (!ExchangeData.instance) ExchangeData.instance = new ExchangeData();
        return ExchangeData.instance;
    }

    private liveData = Live.getInstance();
    private liveSocketTimeout: NodeJS.Timeout | null = null;

    private historicalData = HistoricalData.getInstance();
    private cryptoData = CryptoData.getInstance();
    private currencyData = CurrencyData.getInstance();
    private commodityData = CommodityData.getInstance();

    private io: IO;
    private entities: { [symbol: string]: ExchangeEntity } = {};

    constructor() {
        this.io = IO.getInstance();
    }

    init = async () => {
        try {
            await this.fetchSymbols();

            this.subscribeHistoryData();

            this.subscribeNewDataCallback();
            this.subscribeLiveData();
        } catch(error) {
            console.error('Data init error:', error);
        }
    };

    getSymbols = (): {
        [entityType in EntityTypes]: ExchangeEntity[]
    } => {
        return  {
            [EntityTypes.crypto]: Object.values(
                this.cryptoData.getSymbols()
            ),
            [EntityTypes.commodity]: Object.values(
                this.commodityData.getSymbols()
            ),
            [EntityTypes.currency]: Object.values(
                this.currencyData.getSymbols()
            ),
        }
    };

    getAllHistoricalData = (isShortTime = false): TypeHistoricalPricesResponse => {
        return this.historicalData.getData(
            Object.values(this.entities),
            isShortTime
        );
    }

    getAllHistoricalDataByType = (
        type: EntityTypes,
        isShortTime = false
    ): TypeHistoricalPricesResponse => {
        let entities: ExchangeEntity[] = [];
        
        if (type === EntityTypes.crypto) {
            entities = Object.values(this.cryptoData.getSymbols());
        } else if (type === EntityTypes.commodity) {
            entities = Object.values(this.commodityData.getSymbols());
        } else if (type === EntityTypes.currency) {
            entities = Object.values(this.currencyData.getSymbols());
        }
                
        return this.historicalData.getData(
            entities,
            isShortTime
        );
    }

    getHistoricalData = (
        symbol: string,
        isShortTime = false
    ): TypeHistoricalPricesResponse => {
        if (!this.entities[symbol]) {
            return {};
        }

        return this.historicalData.getData(
            [this.entities[symbol]],
            isShortTime
        );
    }
    

    getCurrentData = (): TypeData[] => ([
        ...this.cryptoData.getData(),
        ...this.currencyData.getData(),
        ...this.commodityData.getData(),        
    ]);

    private fetchSymbols = async () => {
        await this.cryptoData.fetchSymbols();
        await this.currencyData.fetchSymbols();
        await this.currencyData.fetchSymbols();

        this.entities = {};
        Object.values(this.getSymbols()).forEach(entities => {
            entities.forEach(entity => {
                this.entities[entity.symbol] = entity;
            });            
        });
    };

    private subscribeNewDataCallback = () => {
        this.setLiveSocketTimeout();

        this.liveData.subscribeNewDataCallback(data => {
            this.setLiveSocketTimeout();

            if (data.type === EntityTypes.crypto) {
                this.cryptoData.onNewData(data);
            } else if (data.type === EntityTypes.currency) {
                this.currencyData.onNewData(data);
            } else if (data.type === EntityTypes.commodity) {
                this.commodityData.onNewData(data);
            }

            this.io.addNewData(data.s, data);
        });
    };

    private setLiveSocketTimeout = () => {
        if (this.liveSocketTimeout) {
            clearTimeout(this.liveSocketTimeout);
        }

        this.liveSocketTimeout = setTimeout(() => {
            this.liveData.reconnect();

            this.subscribeLiveData();
        }, FINNHUB_SOCKET_WAIT_TIME_BEFORE_RESET);
    }

    private subscribeHistoryData = () => {
        const symbols = [
            ...Object.values(
                this.cryptoData.getSymbols()
            ),
            ...Object.values(
                this.currencyData.getSymbols()
            ),
            ...Object.values(
                this.commodityData.getSymbols()
            ),
        ];

        this.historicalData.subscribeSymbols(...symbols);
    };

    private subscribeLiveData = () => {
        const symbols = [
            ...Object.values(
                this.cryptoData.getSymbols()
            ),
            ...Object.values(
                this.currencyData.getSymbols()
            ),
            ...Object.values(
                this.commodityData.getSymbols()
            ),
        ];
        
        this.liveData.addSymbols(...symbols);
    }
}