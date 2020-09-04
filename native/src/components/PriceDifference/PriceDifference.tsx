import React, { memo } from 'react';
import { View, Text } from 'native-base';
import { StyleSheet } from 'react-native';
import { COLORS, TYPOS } from 'styles';

interface PriceDifferenceProps {
    last: number | null;
    current: number;
}

const _PriceDifference = ({ last, current }: PriceDifferenceProps) => {
    let difference = 0;

    if (last !== null) {
        difference = (current - last) / last;
    }

    let display = (difference * 100).toPrecision(3) + '%';
    let textStyle = styles.text;

    if (difference === 0) {
        display = '+' + display;
    } else if (difference > 0) {
        display = '+' + display;
        textStyle = {
            ...textStyle,
            ...styles.textUp
        };
    } else {
        textStyle = {
            ...textStyle,
            ...styles.textDown
        };       
    }

    return (
        <View style={styles.wrapper}>
            <Text style={textStyle}>{display}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center'
    },
    text: {
        color: COLORS.white,
        ...TYPOS.normal,
        fontWeight: '500',
    },
    textUp: {
        color: COLORS.greenBright
    },
    textDown: {
        color: COLORS.redBright
    }
});

export const PriceDifference = memo(_PriceDifference);
