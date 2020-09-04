import { controller, get } from './decorators';
import { ExchangeData } from '../data';

import { Request, Response } from 'express';
import { EntityTypes } from '../types';

@controller('/history')
export class HistoryController {
    @get('/short/:type')
    getShortTimeHistoricalDataByType(req: Request, res: Response) {
        const { type } = req.params as { type?: EntityTypes };

        if (!type || !Object.values(EntityTypes).includes(type)) {
            return res.status(422).send('Invalid type');
        }

        const exchange = ExchangeData.getInstance();
        const output = exchange.getAllHistoricalData(true);
        res.status(200).send(output);
    }

    @get('/long/:symbol')
    async getHistoricalDataBySymbol(req: Request, res: Response) {
        const { symbol } = req.params as { symbol: string };

        if (!symbol) {
            return res.status(422).send('Missing symbol');
        }

        const exchange = ExchangeData.getInstance();
        const output = exchange.getHistoricalData(symbol);

        return res.status(200).send(output);
    }
}