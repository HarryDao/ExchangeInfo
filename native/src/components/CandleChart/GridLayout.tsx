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
    touchX: number | null;
    touchY: number | null;
}

function _GridLayout ({
    timeScale,
    priceScale,
    contentHeight,
    contentWidth,
    touchX,
    touchY,
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

            <G>
                {touchX !== null && (
                    <Line
                        x1={touchX}
                        x2={touchX}
                        y1={0}
                        y2={contentHeight}
                        stroke={COLORS.white}
                        strokeWidth='0.7'
                        strokeDasharray='5 5'
                    />
                )}

                {touchY !== null && (
                    <Line
                        x1={0}
                        x2={contentWidth}
                        y1={touchY}
                        y2={touchY}
                        stroke={COLORS.white}
                        strokeWidth='0.7'
                        strokeDasharray='5 5'        
                    />
                )}
            </G>
        </G>
    );
}

export const GridLayout = memo(_GridLayout);