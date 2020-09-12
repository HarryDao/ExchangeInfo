import React, { memo, useCallback } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Button, Text } from 'native-base';
import { TYPOS, COLORS } from 'styles';
import { CURRENCY_IMAGES } from 'images';

interface CurrencyLabelItemProps {
    label: string;
    isActive: boolean;
    onLabelPress: (label: string) => {};
}

const _CurrencyLabelItem = ({
    label,
    isActive,
    onLabelPress,
}: CurrencyLabelItemProps) => {
    const onPress = useCallback(() => {
        onLabelPress(label);
    }, [onLabelPress, label]);

    return (
        <Button
            style={{
                ...styles.button,
                ...(isActive ? styles.buttonActive : {})
            }}
            onPress={onPress}
        >
            <Image
                style={styles.image}
                source={CURRENCY_IMAGES[label.toLowerCase()]}
            />
            <Text
                style={{
                    ...styles.text,
                    ...(isActive ? styles.textActive : {})
                }}
            >
                {label}
            </Text>
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'transparent',
        height: 40,
        marginLeft: 5,
        marginRight: 5,
        borderColor: COLORS.grey,
        borderWidth: 1,
        borderStyle: 'solid',
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 30,
    },
    buttonActive: {
        borderColor: COLORS.greenBright,
    },
    image: {
        backgroundColor: 'transparent',
        width: 30,
        height: 30,
        borderRadius: 30,
    },
    text: {
        ...TYPOS.normal,
        color: COLORS.grey,
        fontWeight: '500',
    },
    textActive: {
        color: COLORS.white,
    }
});

export const CurrencyLabelItem = memo(_CurrencyLabelItem);