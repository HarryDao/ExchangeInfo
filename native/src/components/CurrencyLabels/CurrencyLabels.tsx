import React, { memo } from 'react';
import { StyleSheet, ScrollView, FlatList } from 'react-native';
import { Button, Text } from 'native-base';
import { CurrencyLabelItem } from './CurrencyLabelItem';
import { COLORS, TYPOS } from 'styles';

interface CurrencyLabelProps {
    currencies: string[];
    highlightCurrency: string;
    onReset: () => any;
    onPress: (nextCurrency: string) => any;
}

const _CurrencyLabels = ({
    currencies,
    highlightCurrency,
    onReset,
    onPress,
}: CurrencyLabelProps) => {
    return (
        <FlatList
            style={styles.list}
            horizontal
            data={currencies}
            keyExtractor={c => c}
            ListHeaderComponent={
                <CurrencyLabelItem
                    label='All'
                    isActive={highlightCurrency === ''}
                    onLabelPress={onReset}
                />
            }
            renderItem={({ item: currency }) => (
                <CurrencyLabelItem
                    label={currency}
                    isActive={highlightCurrency === currency}
                    onLabelPress={onPress}
                />
            )}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        paddingVertical: 10,
    }
});

export const CurrencyLabels = memo(_CurrencyLabels);