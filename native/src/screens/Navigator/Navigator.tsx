import React, { memo, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { connect } from 'react-redux';
import * as ScreenOrientation from 'expo-screen-orientation';
import { fetchPrices } from 'actions';
import { RootStack } from './RootStack';

interface NavigatorProps {
    fetchPrices: Function
}

function _Navigator({ fetchPrices }: NavigatorProps) {
    useEffect(() => {
        fetchPrices();
    }, [fetchPrices]);

    return (
        <NavigationContainer>
            <RootStack/>
        </NavigationContainer>
    );
}

export const Navigator = connect(
    null,
    {
        fetchPrices
    }
)(memo(_Navigator));