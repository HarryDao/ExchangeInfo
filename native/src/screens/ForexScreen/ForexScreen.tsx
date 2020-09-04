import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { PricePanel } from 'components';
import { fetchShortTimeCurrency } from 'actions';
import { COLORS } from 'styles';

import { StoreState } from 'reducers';
import { TypeHistoricalPrices, TypePrices } from 'apis';
import { ForexScreenNavProps } from 'screens';

interface ForexScreenProps extends ForexScreenNavProps {
    prices: TypePrices;
    loading: boolean;
    error: boolean;
    shortHistory: TypeHistoricalPrices;
    shortHistoryLoading: boolean;
    shortHistoryError: boolean;
    fetchShortTimeCurrency: Function;
}

class _ForexScreen extends React.PureComponent<ForexScreenProps> {
    componentDidMount() {
        this.props.fetchShortTimeCurrency();
    }

    render() {
        const {
            prices,
            shortHistory,
        } = this.props;

        return (
            <Container style={styles.wrapper}>
                <Content>
                    {Object.values(prices).map((price, index) => {
                        return (
                            <PricePanel
                                key={price.s}
                                index={index}
                                price={price}
                                history={shortHistory[price.s]}
                            />
                        );
                    })}
                </Content>
            </Container>
        );
    }
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.black
    }
});

const mapStateToProps = ({
    price,
    shortHistory
}: StoreState) => {
    return {
        prices: price.currency,
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