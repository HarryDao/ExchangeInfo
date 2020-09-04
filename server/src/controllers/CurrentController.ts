import { controller, get } from './decorators';
import { ExchangeData } from '../data';

import { Request, Response } from 'express';

@controller('/current')
export class CurrentController {
    @get('/')
    getCurrentData(req: Request, res: Response) {
        const exchange = ExchangeData.getInstance();
        const data = exchange.getCurrentData();
        res.status(200).send(data);
    }
}