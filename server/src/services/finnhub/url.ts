import {
    FINNHUB_KEY,
    FINNHUB_URL,
} from '../../configs';

export const createFinhubUrl = (path: string): string => {
    const url = `${FINNHUB_URL}${path}`;
    const token = `token=${FINNHUB_KEY.request}`;
    if (url.includes('?')) {
        return `${url}&${token}`;
    } else {
        return `${url}?${token}`;
    }
}