import React from 'react';

import {
    ListTabNavigationProp,
    ListTabRouteProp,
} from 'screens';

export type MainStackNavContextProps = {
    navigation?: ListTabNavigationProp,
    route?: ListTabRouteProp
};

export const MainStackNavContext = React.createContext<
    MainStackNavContextProps
>({});