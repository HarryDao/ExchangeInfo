export const FOREX_CURRENCIES = [
    'USD',
    'EUR',
    'JPY',
    'GBP',
    'AUD',
    'CAD',
];

export const FOREX_COMMODITIES = {
    soybeans: 'SOYBN/USD',
    platinum: 'XPT/USD',
    corn: 'CORN/USD',
    gold: 'XAU/USD',
    silver: 'XAG/USD',
    crude_oil: 'BCO/USD',
    natural_gas: 'NATGAS/USD',
    wheat: 'WHEAT/USD',
    sugar: 'SUGAR/USD',
    copper: 'XCU/USD',
}


// Binance
export const CRYPTOS = {
    bitcoin: 'BTC/USDT',
    etherium: 'ETH/USDT',
    litecoin: 'LTC/USDT',
};

// Gemini
// export const CRYPTOS = {
//     bitcoin: 'BTC/USD',
//     etherium: 'ETH/USD',
//     litecoin: 'LTC/USD',
// };

export const HISTORICAL_PRICES_EXPIRY = 1 * 24 * 60 * 60 * 1000; // 1 day in ms
export const HISTORICAL_LENGTH_UNIT = 1 * 24 * 60 * 60 * 1000; // 1 day
export const HISTORICAL_LENGTH = 3 * 30; // 90 units(days)
export const HISTORICAL_SHORT_LENGTH = 10; // 10 units(days)
export const HISTORICAL_RESOLUTION = 'D';
export const HISTORICAL_FETCH_BUFFER_TIME = 2000;
export const HISTORICAL_FETCH_SUCCESS_STATUS = 'ok';

export const SIGNAL_NEW_DATA_INTERVAL = 3 * 1000; //ms