import React, { memo, useEffect } from 'react';
import { Container, Content, View, Text } from 'native-base';
import { StyleSheet } from 'react-native';
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
}: CommodityScreenProps) => {
    useEffect(() => {
        fetchShortTimeCommodity();
    }, []);

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

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.black
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