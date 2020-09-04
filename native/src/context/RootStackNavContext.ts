import React from 'react';

import {
    MainStackNavigationProp,
    MainStackRouteProp,
} from 'screens';

export type RootStackNavContextProps = {
    navigation?: MainStackNavigationProp,
    route?: MainStackRouteProp,
}

export const RootStackNavContext = React.createContext<
    RootStackNavContextProps
>({});