import React from 'react';
import { G, Line, Text, Rect } from 'react-native-svg';
import { CANDLE_CONFIGS } from 'configs';
import { COLORS } from 'styles';

import { PriceScale } from './PriceScale';

const { Y_WIDTH } = CANDLE_CONFIGS;

function formatNumber(number: number) {
    if (number >= 1) {
        return number.toPrecision(5);
    } else {
        return number.toPrecision(4);
    }
}

interface CandleYAxisProps {
    x: number;
    y: number;
    contentHeight: number;
    scale: PriceScale | null;
    touchY: number | null;
}

export class CandleYAxis extends React.PureComponent<CandleYAxisProps> {
    render() {
        const {
            x,
            y,
            contentHeight,
            scale,
            touchY,
        } = this.props;

        if (!scale) return null;

        const touchPrice = touchY === null
            ? -1
            : scale.getPriceFromPosition(touchY) as number;

        return (
            <G
                x={x}
                y={y}
            >
                <Rect
                    x={0}
                    y={0}
                    width={Y_WIDTH}
                    height={contentHeight}
                    fill={COLORS.black}
                />
                
                <Line
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={contentHeight}
                    stroke={COLORS.grey}
                    strokeWidth={2}
                />

                <G>
                    {scale.getLabels().map(({ price, position }) => {
                        return (
                            <G
                                key={price}
                                x={0}
                                y={position}
                            >
                                <Line
                                    x1={0}
                                    y1={0}
                                    x2={5}
                                    y2={0}
                                    stroke={COLORS.grey}
                                    strokeWidth='2'
                                />
                                <Text
                                    x={10}
                                    fontSize={10}
                                    stroke={COLORS.grey}
                                    alignmentBaseline='middle'
                                    fontWeight='100'
                                >
                                    {formatNumber(price)}
                                </Text>
                            </G>
                        );
                    })}
                </G>

                {touchY !== null && (
                    <G
                        x={0}
                        y={touchY}
                    >
                        <Rect
                            x={5}
                            y={-10}
                            width={40}
                            height={20}
                            fill={COLORS.grey}
                        />
                        <Line
                            x1={0}
                            y1={0}
                            x2={5}
                            y2={0}
                            stroke={COLORS.grey}
                            strokeWidth='2'
                        />
                        <Text
                            x={10}
                            fontSize={10}
                            stroke={COLORS.white}
                            fontWeight='300'
                            alignmentBaseline='middle'
                        >
                            {formatNumber(touchPrice)}
                        </Text>                        
                    </G>
                )}
            </G>
        );
    }
}