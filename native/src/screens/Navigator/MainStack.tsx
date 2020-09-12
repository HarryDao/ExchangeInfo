import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackNavContext } from 'context';
import { DetailScreen } from '../DetailScreen';
import { ListTab } from './ListTab';

import { MainStackParamList, MainStackNavProps } from './types';
import { StoreState } from 'reducers';

const Stack = createStackNavigator<
    MainStackParamList
>();

interface MainStackProps extends MainStackNavProps {
    socketIsReady: boolean;
    priceLoading: boolean;
}

function _MainStack({ navigation, route, socketIsReady, priceLoading }: MainStackProps) {
    useEffect(() => {
        if (!socketIsReady || priceLoading) {
            navigation.navigate('LoadingModal');
        } else {
            navigation.navigate('MainStack');
        }
    }, [socketIsReady, priceLoading, navigation]);

    return (
        <RootStackNavContext.Provider value={{ navigation, route }}>
            <Stack.Navigator>
                <Stack.Screen
                    name='ListTab'
                    component={ListTab}
                    
                />
                <Stack.Screen
                    name='DetailScreen'
                    component={DetailScreen}
                />
            </Stack.Navigator>
        </RootStackNavContext.Provider>
    );
}

const mapStateToProps = ({ socket, price }: StoreState) => {
    return {
        socketIsReady: socket.isReady,
        priceLoading: price.loading,
    };
}

export const MainStack = connect(
    mapStateToProps
)(memo(_MainStack));