import React, { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { COLORS, TYPOS } from 'styles';

const getScreenName = (name: string): string => {
    return name.replace(/screen/i, '');
}

type FontAwesome5 = 'FontAwesome5'

const getIcon = (name: string): { type: FontAwesome5; name: string } => {
    if (/forex/i.test(name)) {
        return {
            type: 'FontAwesome5',
            name: 'dollar-sign'
        }
    } else if (/crypto/i.test(name)) {
        return {
            type: 'FontAwesome5',
            name: 'btc'
        }
    } else if (/commodity/i.test(name)) {
        return {
            type: 'FontAwesome5',
            name: 'gas-pump'
        }
    }

    return {
        type: 'FontAwesome5',
        name: ''
    }
}

interface ListTabBarButtonProps {
    isActive: boolean;
    name: string;
    onButtonPress: (name: string) => void;
}

const _ListTabBarButton = ({ isActive, name, onButtonPress }: ListTabBarButtonProps) => {
    const onPress = useCallback(() => {
        onButtonPress(name);
    }, [onButtonPress, name]);

    return (
        <Button
            style={styles.button}
            onPress={onPress}
        >
            <Icon
                {...getIcon(name)}
                style={{
                    ...styles.buttonIcon,
                    ...(isActive ? styles.isActive : styles.isInactive)
                }}
            />
            <Text
                style={{
                    ...styles.buttonText,
                    ...(isActive ? styles.isActive : {})
                }}
            >
                {getScreenName(name)}
            </Text>
        </Button>
    );
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        textAlign: 'center',
        backgroundColor: COLORS.transparent,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    buttonText: {
        ...TYPOS.small,
    },
    buttonIcon: {
        ...TYPOS.smedium,
    },
    isActive: {
        color: COLORS.aqua,
    },
    isInactive: {
        color: COLORS.grey,
    }
});

export const ListTabBarButton = memo(_ListTabBarButton);