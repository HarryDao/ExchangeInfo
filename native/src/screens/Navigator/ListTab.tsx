import React, { memo, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    ForexScreen,
    CommodityScreen,
    CryptoScreen
} from 'screens';
import { ListTabBar } from './ListTabBar';
import { MainStackNavContext } from 'context';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
    ListTabParamList,
    ListTabNavProps
} from './types';

const Tab = createBottomTabNavigator<ListTabParamList>();

function _ListTab({ navigation, route }: ListTabNavProps) {
    const renderTabBar = useCallback((props: BottomTabBarProps) => {
        return (
            <ListTabBar
                {...props}
            />
        );
    }, []);

    return (
        <MainStackNavContext.Provider value={{ navigation, route }}>
            <Tab.Navigator
                initialRouteName='ForexScreen'
                tabBar={renderTabBar}
            >
                <Tab.Screen
                    name='ForexScreen'
                    component={ForexScreen}
                />
                <Tab.Screen
                    name='CommodityScreen'
                    component={CommodityScreen}
                />
                <Tab.Screen
                    name='CryptoScreen'
                    component={CryptoScreen}
                />
            </Tab.Navigator>
        </MainStackNavContext.Provider>
    );

}

export const ListTab = memo(_ListTab);