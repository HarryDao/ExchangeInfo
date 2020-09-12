import { createSelector } from 'reselect';
import { StoreState } from 'reducers';
import { TypePrice } from 'apis';

const getCurrencyPricesSelector = (state: StoreState) => state.price.currency;

export interface PriceWithCurrencies extends TypePrice {
    currencies: {
        [currency: string]: boolean
    }
}

export const getCurrencyLabelsSelector = createSelector(
    [getCurrencyPricesSelector],
    (prices) => {
        const currencies: { [currency: string]: boolean } = {};

        const pricesWithCurrencies: PriceWithCurrencies[] = Object.values(prices).map(price => {
            const name = price.name;
            const [currency1, currency2] = name.split('/').map(symbol => symbol.trim());

            currencies[currency1] = true;
            currencies[currency2] = true;

            return {
                ...price,
                currencies: {
                    [currency1]: true,
                    [currency2]: true
                }
            }
        });

        return {
            prices: pricesWithCurrencies,
            currencies: Object.keys(currencies)
        }
    }
)
