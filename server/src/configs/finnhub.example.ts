export const FINNHUB_KEY = {
    request: '',
    socket: ''
}
export const FINNHUB_SOCKET_URL = 'wss://ws.finnhub.io';
export const FINNHUB_URL = 'https://finnhub.io/api/v1';
export const FINNHUB_SOCKET_WAIT_TIME_BEFORE_RESET = 30 * 60 * 1000; // ms;

export enum FINNHUB_REQUEST_ENDPOINTS {
    forexExchanges = '/forex/exchange',
    forexSymbols = '/forex/symbol?exchange=oanda',
    forex = '/forex/candle',
    cryptoSymbols = '/crypto/symbol?exchange=binance',
    crypto = '/crypto/candle',
};