import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { IO } from './services';
import { ExchangeData } from './data';
import { AppRouter } from './AppRouter';
import './controllers';
import { PORT } from './configs';

(function() {
    const app = express();
    const server = http.createServer(app);
    
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);

        IO.getInstance(server);
        ExchangeData.getInstance().init();
    });
    
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(cors());
    app.use(AppRouter.getInstance());
})();
