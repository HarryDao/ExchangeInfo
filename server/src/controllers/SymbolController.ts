import { controller, get } from './decorators';
import { ExchangeData } from '../data';

import { Request, Response } from 'express';

@controller('/symbols')
export class SymbolController {
    @get('')
    getSymbols(req: Request, res: Response) {
        const exchange = ExchangeData.getInstance();
        const symbols = exchange.getSymbols();
        res.status(200).send(symbols);
    }
}