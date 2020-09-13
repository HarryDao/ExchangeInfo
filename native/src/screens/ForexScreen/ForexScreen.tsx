import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView } from 'react-native';
import { Container, Content, Text, View } from 'native-base';
import {
    PricePanel,
    CurrencyLabels,
} from 'components';
import {
    getCurrencyLabelsSelector,
    PriceWithCurrencies,
} from './selectors';
import { fetchShortTimeCurrency } from 'actions';
import { COLORS } from 'styles';

import { StoreState } from 'reducers';
import { TypeHistoricalPrices, TypePrices, TypePrice } from 'apis';
import { ForexScreenNavProps } from 'screens';

interface ForexScreenProps extends ForexScreenNavProps {
    prices: PriceWithCurrencies[];
    currencies: string[],
    loading: boolean;
    error: boolean;
    shortHistory: TypeHistoricalPrices;
    shortHistoryLoading: boolean;
    shortHistoryError: boolean;
    fetchShortTimeCurrency: Function;
}

interface ForexScreenState{
    highlightCurrency: string;
}

const INITIAL_STATE: ForexScreenState = {
    highlightCurrency: ''
}

class _ForexScreen extends React.PureComponent<
    ForexScreenProps,
    ForexScreenState
> {
    state = INITIAL_STATE

    componentDidMount() {
        this.props.fetchShortTimeCurrency();
    }

    onCurrencyPress = (nextCurrency: string) => {
        this.setState({
            highlightCurrency: nextCurrency
        });
    }

    onHighlightCurrencyReset = () => {
        this.setState({
            highlightCurrency: INITIAL_STATE.highlightCurrency
        });
    }

    render() {
        const {
            shortHistory,
            shortHistoryLoading,
            prices,
            currencies
        } = this.props;
        const { highlightCurrency } = this.state;

        return (
            <Container style={styles.wrapper}>
                <Content
                    style={styles.content}
                >
                    <CurrencyLabels
                        currencies={currencies}
                        highlightCurrency={highlightCurrency}
                        onReset={this.onHighlightCurrencyReset}
                        onPress={this.onCurrencyPress}
                    />

                    <View style={styles.priceWrapper}>
                        {prices.map((price, index) => {
                            return (
                                <PricePanel
                                    key={price.s}
                                    index={index}
                                    price={price}
                                    history={shortHistory[price.s]}
                                    historyLoading={shortHistoryLoading}
                                    hide={
                                        highlightCurrency &&
                                        !price.currencies[highlightCurrency]
                                    }
                                />
                            );
                        })}
                    </View>
                </Content>
            </Container>
        );
    }
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.black
    },
    content: {
        paddingTop: 10,
    },
    priceWrapper: {

    }
});

const mapStateToProps = (state: StoreState) => {
    const { prices, currencies } = getCurrencyLabelsSelector(state);
    const { price, shortHistory } = state;
    return {
        prices,
        currencies,
        loading: price.loading,
        error: price.error,
        shortHistory: shortHistory.currency,
        shortHistoryLoading: shortHistory.currencyLoading,
        shortHistoryError: shortHistory.currencyError
    }
}

export const ForexScreen = connect(
    mapStateToProps,
    {
        fetchShortTimeCurrency
    }
)(_ForexScreen);