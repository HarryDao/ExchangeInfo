import React from 'react';
import { G, Rect } from 'react-native-svg';
import { CANDLE_CONFIGS } from 'configs';
import { COLORS } from 'styles';

import { TypeCandle } from 'apis';
import { PriceScale } from './PriceScale';
import { TimeScale } from './TimeScale';

const { TICK_WIDTH } = CANDLE_CONFIGS;

const PADDING = TICK_WIDTH * 0.2;
const CLOSE_OPEN_WIDTH = TICK_WIDTH - 2 * PADDING;
const HIGH_LOW_WIDTH = CLOSE_OPEN_WIDTH / 4;

interface CandleTickProps {
    price: TypeCandle,
    priceScale: PriceScale | null;
    timeScale: TimeScale | null;
}

export class CandleTick extends React.PureComponent<CandleTickProps> {
    analyze = (): {
        upper: number;
        lower: number;
        isIncrease: boolean;
    } => {
        const { price: { o, c } } = this.props;
        let upper: number, lower: number;

        if (o > c) {
            upper = o;
            lower = c;
        } else {
            upper = c;
            lower = o;
        }

        return {
            upper,
            lower,
            isIncrease: o < c
        };

    }

    renderHighLow = (isIncrease: boolean) => {
        const {
            priceScale,
            price: { h, l }
        } = this.props;

        if (!priceScale) return null;

        const y1 = priceScale.getPositionFromPrice(h);
        const y2 = priceScale.getPositionFromPrice(l);

        if (y1 === null || y2 === null) return null;

        return (
            <Rect
                x={- HIGH_LOW_WIDTH / 2}
                width={HIGH_LOW_WIDTH}
                y={y1}
                height={y2 - y1}
                fill={isIncrease ? COLORS.greenBright : COLORS.redBright}
            />
        );
    }

    renderCloseOpen = (
        upper: number,
        lower: number,
        isIncrease: boolean
    ) => {
        const { priceScale } = this.props;

        if (!priceScale) return null;

        const y1 = priceScale.getPositionFromPrice(upper);
        const y2 = priceScale.getPositionFromPrice(lower);

        if (y1 === null || y2 === null) return null;

        return (
            <Rect
                x={-CLOSE_OPEN_WIDTH / 2}
                width={CLOSE_OPEN_WIDTH}
                y={y1}
                height={y2 - y1}
                fill={isIncrease ? COLORS.greenBright : COLORS.redBright}
            />            
        );
    }

    render() {
        const {
            timeScale,
            priceScale,
            price,
        } = this.props;

        if (!timeScale || !priceScale) return null;

        const { upper, lower, isIncrease } = this.analyze();
        const x = timeScale.getPosition(price.t) as number;

        return (
            <G
                x={x}
            >
                {this.renderCloseOpen(upper, lower, isIncrease)}
                {this.renderHighLow(isIncrease)}
            </G>
        );
    }
}