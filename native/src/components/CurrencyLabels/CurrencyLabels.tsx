import React, { memo } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
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
        <ScrollView
            horizontal
        >
            <CurrencyLabelItem
                label='All'
                isActive={highlightCurrency === ''}
                onLabelPress={onReset}
            />

            {currencies.map(currency => (
                <CurrencyLabelItem
                    key={currency}
                    label={currency}
                    isActive={highlightCurrency === currency}
                    onLabelPress={onPress}
                />
            ))}
        </ScrollView>
    );
};



export const CurrencyLabels = memo(_CurrencyLabels);