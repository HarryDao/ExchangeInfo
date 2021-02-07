import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Container, Content, Text, View, List, ListItem } from 'native-base';
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
            <SafeAreaView style={styles.wrapper}>
                <Container style={styles.container}>
                    <View>
                        <CurrencyLabels
                            currencies={currencies}
                            highlightCurrency={highlightCurrency}
                            onReset={this.onHighlightCurrencyReset}
                            onPress={this.onCurrencyPress}
                        />
                    </View>

                    <FlatList
                        style={styles.list}
                        data={prices}
                        keyExtractor={p => p.s}
                        renderItem={({ item: price, index }) => (
                            <PricePanel
                                index={index}
                                price={price}
                                history={shortHistory[price.s]}
                                historyLoading={shortHistoryLoading}
                                hide={
                                    highlightCurrency &&
                                    !price.currencies[highlightCurrency]
                                }
                            />
                        )}
                    />
                </Container>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.black,
        flex: 1,
    },
    container: {
        backgroundColor: COLORS.black,
    },
    content: {
        paddingTop: 10,
    },
    list: {
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