import {
    MIN_API_FETCHING_TIME,
    DEFAULT_PEGGING_CURRENCY,
} from 'configs';

import {
    EntityTypes,
    TypePrice,
    TypePrices,
    MappedPrices
} from '../apis/types';

export const mapPrices = (data: TypePrice[]): MappedPrices => {
    const mapped: MappedPrices = {
        [EntityTypes.commodity]: {},
        [EntityTypes.crypto]: {},
        [EntityTypes.currency]: {},
    };

    data.forEach(d => {
        mapped[d.type][d.s] = d;
    });

    return mapped;
};

export const formatName = (name: string): string => {
    if (!name) return name;

    let pair = ['', DEFAULT_PEGGING_CURRENCY];

    if (name.includes('/')) {
        pair = name.split('/');
    } else {
        pair[0] = name.split('_')
            .map(w => {
                const chrs = w.split('');
                chrs[0] = chrs[0].toUpperCase();
                return chrs.join('');
            })
            .join(' ');
    }

    return pair.map(p => p.trim()).join(' / ');
};

export const setAPITimer = (): () => number => {
    const start = new Date().getTime();

    return function(): number {
        const lapsed = new Date().getTime() - start;
        return Math.max(MIN_API_FETCHING_TIME - lapsed, 0);
    }
}