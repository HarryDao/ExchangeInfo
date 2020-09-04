import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { Container, Content, View, Text } from 'native-base';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOS } from 'styles';

import { LoadingModalNavProps } from 'screens';
import { StoreState } from 'reducers';

const SOCKET_IS_READY_TEXT = 'Establishing Secure Connection'
const PRICE_IS_LOADING_TEXT = 'Fetching data'

interface LoadingModalProps extends LoadingModalNavProps {
    socketIsReady: boolean;
    priceLoading: boolean;
}

const _LoadingModal = ({ socketIsReady, priceLoading }: LoadingModalProps) => {
    let text = '';

    if (!socketIsReady) {
        text = SOCKET_IS_READY_TEXT;
    } else if (priceLoading) {
        text = PRICE_IS_LOADING_TEXT;
    }

    return (
        <Container style={styles.wrapper}>
            <StatusBar style='light'/>
            <View style={styles.inner}>
                <ActivityIndicator
                    color={COLORS.white}
                    size='large'
                />
                <Text style={styles.text}>
                    {text}
                </Text>
            </View>
        </Container>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.black_transparent,
        justifyContent: 'center'
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        ...TYPOS.medium,
        width: '80%',
        marginTop: 10,
        color: COLORS.white,
        textAlign: 'center',
    }
});

const mapStateToProps = ({ socket, price }: StoreState) => {
    return {
        socketIsReady: socket.isReady,
        priceLoading: price.loading,
    };
}

export const LoadingModal = connect(
    mapStateToProps
)(memo(_LoadingModal));