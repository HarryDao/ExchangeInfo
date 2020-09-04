import React, { memo } from 'react';
import { Header, Text, Button, Icon, View } from 'native-base';
import { StyleSheet } from 'react-native';
import { COLORS, TYPOS } from 'styles';

interface DetailScreenHeaderProps {
    onBackPress: () => void
    name: string;
    symbol: string;
}

const _DetailScreenHeader = ({ onBackPress, name, symbol }: DetailScreenHeaderProps) => {
    return (
        <Header
            style={styles.wrapper}
        >
            <Button
                onPress={onBackPress}
                style={styles.button}
            >
                <Icon
                    type='EvilIcons'
                    name='chevron-left'
                    style={styles.icon}
                />
            </Button>
            <View style={styles.title}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.symbol}>
                    {symbol}
                </Text>
            </View>
        </Header>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
        backgroundColor: COLORS.transparent,
        alignItems: 'center',
        borderBottomColor: COLORS.transparent,
        paddingBottom: 20,
    },
    button: {
        position: 'absolute',
        height: '100%',
        top: 0,
        bottom: 0,
        left: 0,
        backgroundColor: COLORS.transparent,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    icon: {
        fontSize: TYPOS.large.lineHeight,
        color: COLORS.white,
        paddingLeft: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0
    },
    title: {
        alignItems: 'center',
    },
    name: {
        ...TYPOS.smedium,
        color: COLORS.aqua,
        fontWeight: '600',
    },
    symbol: {
        ...TYPOS.normal,
        color: COLORS.grey
    }
});

export const DetailScreenHeader = memo(_DetailScreenHeader);