import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from 'native-base';
import { Svg, Line, Path, G } from 'react-native-svg';
import * as d3 from 'd3';
import { COLORS } from 'styles';

import { TypeHistoricalPrice, TypeCandle } from 'apis';
import { SvgProps } from 'react-native-svg';


interface LineChartProps {
    history?: TypeHistoricalPrice,
    current: number,
}

export class LineChart extends React.PureComponent<
    LineChartProps
> {
    svg: React.Component<SvgProps> | null = null;

    render() {
        const width = 150;
        const height = 50;
        const { history, current } = this.props;

        if (!history || !history.prices.length) return null;
        
        const { prices } = history;
        const timeDomain = d3.extent(prices.map(p => p.t)) as [number, number];
        const priceDomain = d3.extent(prices.map(p => p.c)) as [number, number];
        
        const scaleX = d3.scaleTime().domain(timeDomain).range([0, width]);
        const scaleY = d3.scaleLinear().domain(priceDomain).range([height, 0]);
        const line = d3.line<TypeCandle>()
            .x(d => scaleX(d.t))
            .y(d => scaleY(d.c))
            .curve(d3.curveBasis)(prices) || undefined;

        const lastPrice = history && history.prices ? history.prices[0].c : null;
        const isIncreasing = lastPrice === null 
            ? true 
            : current > lastPrice;

        return (
            <View style={styles.wrapper}>
                <Svg
                    width={width}
                    height={height}
                >
                    <Path
                        d={line}
                        stroke={isIncreasing ? COLORS.greenBright : COLORS.redBright}
                        fill={COLORS.transparent}
                        strokeWidth={4}
                    />
                </Svg>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        marginBottom: 5,
    }
})