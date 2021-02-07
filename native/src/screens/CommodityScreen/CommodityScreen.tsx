import React, { memo, useEffect } from 'react';
import { Container, Content, View, Text } from 'native-base';
import { SafeAreaView, StyleSheet, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { connect } from 'react-redux';
import { fetchShortTimeCommodity } from 'actions';
import { COLORS } from 'styles';
import { PricePanel } from 'components';

import { StoreState } from 'reducers';
import { CommodityScreenNavProps } from 'screens';
import { TypePrices, TypeHistoricalPrices } from 'apis';

interface CommodityScreenProps extends CommodityScreenNavProps  {
    prices: TypePrices;
    loading: boolean;
    error: boolean;
    shortHistory: TypeHistoricalPrices;
    shortHistoryLoading: boolean;
    shortHistoryError: boolean;
    fetchShortTimeCommodity: Function;
}

const _CommodityScreen = ({
    fetchShortTimeCommodity,
    prices,
    shortHistory,
    shortHistoryLoading
}: CommodityScreenProps) => {
    useEffect(() => {
        fetchShortTimeCommodity();
    }, []);

    return (
        <SafeAreaView  style={styles.wrapper}>
            <StatusBar hidden/>
            <Container style={styles.container}>
                <FlatList
                    data={Object.values(prices)}
                    keyExtractor={p => p.s}
                    renderItem={({ item: price, index }) => (
                        <PricePanel
                            key={price.s}
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

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.black,
        flex: 1,
    },
    container: {
        backgroundColor: COLORS.black,
        paddingTop: 10,
    }
});

const mapStateToProps = ({ price, shortHistory }: StoreState) => {
    return {
        prices: price.commodity,
        loading: price.loading,
        error: price.error,
        shortHistory: shortHistory.commodity,
        shortHistoryLoading: shortHistory.commodityLoading,
        shortHistoryError: shortHistory.commodityError,
    };
}

export const CommodityScreen = connect(
    mapStateToProps,
    {
        fetchShortTimeCommodity
    }
)(memo(_CommodityScreen));