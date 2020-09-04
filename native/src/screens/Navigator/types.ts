import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { TypeExchangeEntity } from 'apis';

// Param List

export type RootStackParamList = {
    MainStack: undefined;
    LoadingModal: undefined;
};

export type MainStackParamList = {
    ListTab: undefined;
    DetailScreen: TypeExchangeEntity;
};

export type ListTabParamList = {
    ForexScreen: undefined;
    CommodityScreen: undefined;
    CryptoScreen: undefined;
};

// RootStack

export type MainStackNavigationProp = StackNavigationProp<
    RootStackParamList,
    'MainStack'
>;

export type MainStackRouteProp = RouteProp<
    RootStackParamList,
    'MainStack'
>;

export interface MainStackNavProps {
    navigation: MainStackNavigationProp,
    route: MainStackRouteProp
};

export type LoadingModalNavigationProp = StackNavigationProp<
    RootStackParamList,
    'LoadingModal'
>;

export type LoadingModalRouteProp = RouteProp<
    RootStackParamList,
    'LoadingModal'
>;

export interface LoadingModalNavProps {
    navigation: LoadingModalNavigationProp,
    route: LoadingModalRouteProp
};

// Main Stack

export type ListTabNavigationProp = StackNavigationProp<
    MainStackParamList,
    'ListTab'
>;

export type ListTabRouteProp = RouteProp<
    MainStackParamList,
    'ListTab'
>;

export interface ListTabNavProps {
    navigation: ListTabNavigationProp;
    route: ListTabRouteProp
};

export type DetailScreenNavigationProp = StackNavigationProp<
    MainStackParamList,
    'DetailScreen'
>;

export type DetailScreenRouteProp = RouteProp<
    MainStackParamList,
    'DetailScreen'
>;

export interface DetailScreenNavProps {
    navigation: DetailScreenNavigationProp;
    route: DetailScreenRouteProp
};

// List Tab

export type ForexScreenNavigationProp = BottomTabNavigationProp<
    ListTabParamList,
    'ForexScreen'
>;

export type ForexScreenRouteProp = RouteProp<
    ListTabParamList,
    'ForexScreen'
>;

export interface ForexScreenNavProps {
    navigation: ForexScreenNavigationProp;
    route: ForexScreenRouteProp;
}

export type CommodityScreenNavigationProp = BottomTabNavigationProp<
    ListTabParamList,
    'CommodityScreen'
>;

export type CommodityScreenRouteProp = RouteProp<
    ListTabParamList,
    'CommodityScreen'
>;

export interface CommodityScreenNavProps {
    navigation: CommodityScreenNavigationProp;
    route: CommodityScreenRouteProp,
}

export type CryptoScreenNavigationProp = BottomTabNavigationProp<
    ListTabParamList,
    'CryptoScreen'
>;

export type CryptoScreenRouteProp = RouteProp<
    ListTabParamList,
    'CryptoScreen'
>;

export interface CryptoScreenNavProps {
    navigation: CryptoScreenNavigationProp,
    route: CryptoScreenRouteProp
};