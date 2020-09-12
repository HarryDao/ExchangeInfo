import React, { memo, useCallback } from 'react';
import { View, Text, Button, Icon } from 'native-base';
import { StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { COLORS, TYPOS } from 'styles';
import { ListTabBarButton } from './ListTabBarButton';


interface ListTabBarProps extends BottomTabBarProps {}

const _ListTabBar = ({
    state,
    descriptors,
    navigation
}: ListTabBarProps) => {

    const { routes, index: currentIndex } = state;

    const onButtonPress = useCallback((name: string) => {
        navigation.navigate(name);
    }, []);

    return (
        <View style={styles.wrapper}>
            {routes.map((route, index) => {
                return (
                    <ListTabBarButton
                        key={route.key}
                        isActive={index === currentIndex}
                        name={route.name}
                        onButtonPress={onButtonPress}
                    />
                );

            })}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: COLORS.black_light,
        paddingTop: 10,
        paddingBottom: 10,
    },

});

export const ListTabBar = memo(_ListTabBar);