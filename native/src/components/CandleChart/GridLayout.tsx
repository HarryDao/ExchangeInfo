import React, { memo } from 'react';
import { G, Line } from 'react-native-svg';
import {  COLORS} from 'styles';

import { PriceScale } from './PriceScale';
import { TimeScale } from './TimeScale';

interface GridLayoutProps {
    timeScale: TimeScale | null;
    priceScale: PriceScale | null;
    contentHeight: number;
    contentWidth: number;
}

function _GridLayout ({
    timeScale,
    priceScale,
    contentHeight,
    contentWidth
}: GridLayoutProps) {
    return (
        <G>
            <G>
                {timeScale &&  timeScale.getLabels().map(({ position }) => {
                    return (
                        <Line
                            key={position}
                            x1={position}
                            y1={0}
                            x2={position}
                            y2={contentHeight}
                            stroke={COLORS.grey}
                            strokeWidth='0.5'
                            strokeDasharray='1 1'
                        />
                    );
                })}
            </G>

            <G>
                {priceScale && priceScale.getLabels().map(({ position }) => {
                    return (
                        <Line
                            key={position}
                            x1={0}
                            y1={position}
                            x2={contentWidth}
                            y2={position}
                            stroke={COLORS.grey}
                            strokeWidth='0.5'
                            strokeDasharray='1 1'                        
                        />
                    );
                })}
            </G>
        </G>
    );
}

export const GridLayout = memo(_GridLayout);