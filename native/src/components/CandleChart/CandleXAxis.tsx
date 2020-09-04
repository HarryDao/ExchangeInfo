import React from 'react';
import { StyleSheet } from 'react-native';
import * as d3 from 'd3';
import moment, { Moment } from 'moment';
import { G, Line, Text, Rect } from 'react-native-svg';
import { CANDLE_CONFIGS } from 'configs';
import { COLORS } from 'styles';

import { TypeCandle } from 'apis';
import { TimeScale, TimeLabel } from './TimeScale';

const { X_HEIGHT } = CANDLE_CONFIGS;

interface CandleXAxisProps {
    x: number;
    y: number;
    contentWidth: number;
    scale: TimeScale | null;
}

export class CandleXAxis extends React.PureComponent<CandleXAxisProps> {
    render() {
        const { x, y, contentWidth, scale } = this.props;

        if (!scale) return null;
        
        const labels = scale.getLabels();

        return (
            <G
                x={x}
                y={y}
            >
                <Rect
                    x={0}
                    y={0}
                    width={contentWidth}
                    height={X_HEIGHT}
                    fill={COLORS.black}
                />
                <Line
                    x1={0}
                    y1={0}
                    x2={contentWidth}
                    y2={0}
                    stroke={'grey'}
                    strokeWidth="2"                    
                />

                <G>
                    {labels.map(({ date, position }) => {
                        return (
                            <G
                                key={date.valueOf()}
                                x={position}
                                y={0}
                            >
                                <Line
                                    x1={0}
                                    y1={0}
                                    x2={0}
                                    y2={5}
                                    stroke={COLORS.grey}
                                    strokeWidth='2'
                                />
                                <Text
                                    x={0}
                                    y={20}
                                    fontSize={10}
                                    stroke={COLORS.grey}
                                    textAnchor='middle'
                                >
                                    {date.format('DD MMM')}
                                </Text>
                            </G>
                        );
                    })}
                </G>
            </G>
        );
    }
}

const styles = StyleSheet.create({

});