import { controller, get } from './decorators';

import { Request, Response } from 'express';

@controller('')
export class RootController {
    @get('/ping')
    getRoot(req: Request, res: Response) {
        res.send('pong');
    }
}