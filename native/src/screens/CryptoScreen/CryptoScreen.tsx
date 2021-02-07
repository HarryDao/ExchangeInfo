import React from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, StyleSheet, FlatList } from 'react-native';
import { Container, Content, View, Text } from 'native-base';
import { StatusBar } from 'expo-status-bar';
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
        const { prices, shortHistory, shortHistoryLoading } = this.props;

        return (
            <SafeAreaView style={styles.wrapper}>
                <StatusBar hidden/>
                <Container style={styles.container}>
                    <FlatList
                        data={Object.values(prices)}
                        keyExtractor={p => p.s}
                        renderItem={({ item: price, index }) => (
                            <PricePanel
                                index={index}
                                price={price}
                                history={shortHistory[price.s]}
                                historyLoading={shortHistoryLoading}
                            />
                        )}
                    />
                </Container>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.black,
        flex: 1,
    },
    container: {
        backgroundColor: COLORS.black,
        paddingTop: 10,
    },    
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

