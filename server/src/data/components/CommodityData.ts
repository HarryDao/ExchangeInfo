import { Forex } from '../../services/finnhub';

import { TypeData } from '../../types';

export class CommodityData {
    private static instance: CommodityData;
    static getInstance(): CommodityData {
        if (!CommodityData.instance) {
            CommodityData.instance = new CommodityData();
        }
        return CommodityData.instance;
    }

    private forex = Forex.getInstance();
    private data: {[symbol: string]: TypeData} = {};

    fetchSymbols = this.forex.fetchSymbols;
    
    getSymbols = () => this.forex.commodities;

    onNewData = (newData: TypeData) => {
        this.data[newData.s] = newData;
    }

    getData = (): TypeData[] => {
        return Object.values(this.data);
    }
}