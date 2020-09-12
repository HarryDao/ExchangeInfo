import React, { memo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoadingModal } from '../LoadingModal';
import { MainStack } from './MainStack';
import { COLORS } from 'styles';

import {
    RootStackParamList
} from './types';

const Stack = createStackNavigator<RootStackParamList>();

function _RootStack() {
    return (
        <Stack.Navigator mode='modal' initialRouteName='MainStack'>
            <Stack.Screen
                name='MainStack'
                component={MainStack}
                options={{ header: () => null }}
            />
            <Stack.Screen
                name='LoadingModal'
                component={LoadingModal}
                options={{
                    header: () => null,
                    cardStyle: {
                        backgroundColor: COLORS.transparent
                    }
                }}
            />
        </Stack.Navigator>
    );
}

export const RootStack = memo(_RootStack);