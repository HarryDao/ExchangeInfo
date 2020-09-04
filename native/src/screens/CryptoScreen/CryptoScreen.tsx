import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { Container, Content, View, Text } from 'native-base';
import { StoreState } from 'reducers';
import { PricePanel } from 'components';
import { COLORS } from 'styles';
import { fetchShortTimeCrypto } from 'actions';

import { CryptoScreenNavProps } from 'screens';
import { TypePrices, TypeHistoricalPrices } from 'apis';
import { ScrollView } from 'react-native-gesture-handler';

interface CryptoScreenProps extends CryptoScreenNavProps {
    prices: TypePrices;
    loading: boolean;
    error: boolean;
    shortHistory: TypeHistoricalPrices;
    shortHistoryLoading: boolean;
    shortHistoryError: boolean;
    fetchShortTimeCrypto: Function;
}

class _CryptoScreen extends React.PureComponent<CryptoScreenProps> {
    componentDidMount() {
        this.props.fetchShortTimeCrypto();
    }

    render() {
        const { prices, shortHistory } = this.props;

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
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.black
    }
});

const mapStateToProps = ({ price, shortHistory }: StoreState) => {
    return {
        prices: price.crypto,
        loading: price.loading,
        error: price.error,
        shortHistory: shortHistory.crypto,
        shortHistoryLoading: shortHistory.cryptoLoading,
        shortHistoryError: shortHistory.cryptoError,
    };
}

export const CryptoScreen = connect(
    mapStateToProps,
    {
        fetchShortTimeCrypto
    }
)(_CryptoScreen);

