import { SocketIsReady, SocketIsDisconnected } from './socketActions';
import {
    FetchPrices,
    FetchPricesSuccess,
    FetchPricesFailed,
    NewPricesArrived,
} from './priceActions';
import {
    FetchShortTimeCurrency,
    FetchShortTimeCurrencySuccess,
    FetchShortTimeCurrencyError,
    FetchShortTimeCrypto,
    FetchShortTimeCryptoSuccess,
    FetchShortTimeCryptoError,
    FetchShortTimeCommodity,
    FetchShortTimeCommodityError,
    FetchShortTimeCommoditySuccess,
} from './shortHistoryActions';
import {
    FetchDetail,
    FetchDetailSuccess,
    FetchDetailError
} from './detailActions';

export enum ActionTypes {
    socketIsReady = 'socketIsReady',
    socketIsDisconnected = 'socketIsDisconnected',

    fetchPrices = 'fetchPrices',
    fetchPricesSuccess = 'fetchPricesSuccess',
    fetchPricesFailed = 'fetchPricesFailed',

    newPricesArrived = 'newPricesArrived',

    fetchShortTimeCurrency = 'fetchShortTimeCurrency',
    fetchShortTimeCurrencySuccess = 'fetchShortTimeCurrencySuccess',
    fetchShortTimeCurrencyError = 'fetchShortTimeCurrencyError',
    
    fetchShortTimeCommodity = 'fetchShortTimeCommodity',
    fetchShortTimeCommoditySuccess = 'fetchShortTimeCommoditySuccess',
    fetchShortTimeCommodityError = 'fetchShortTimeCommodityError',

    fetchShortTimeCrypto = 'fetchShortTimeCrypto',
    fetchShortTimeCryptoSuccess = 'fetchShortTimeCryptoSuccess',
    fetchShortTimeCryptoError = 'fetchShortTimeCryptoError',

    fetchDetail = 'fetchDetail',
    fetchDetailSuccess = 'fetchDetailSuccess',
    fetchDetailError = 'fetchDetailError',
};

export type Action = SocketIsReady |
    SocketIsDisconnected |

    FetchPrices |
    FetchPricesSuccess |
    FetchPricesFailed |
    NewPricesArrived |

    FetchShortTimeCurrency |
    FetchShortTimeCurrencySuccess |
    FetchShortTimeCurrencyError |

    FetchShortTimeCrypto |
    FetchShortTimeCryptoSuccess |
    FetchShortTimeCryptoError |

    FetchShortTimeCommodity |
    FetchShortTimeCommodityError |
    FetchShortTimeCommoditySuccess |
    
    FetchDetail |
    FetchDetailSuccess |
    FetchDetailError;