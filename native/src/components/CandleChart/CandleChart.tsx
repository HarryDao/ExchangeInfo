import React from 'react';
import {
    StyleSheet,
    Dimensions,
    Animated,
    PanResponder,
    PanResponderInstance
} from 'react-native';
import { View } from 'native-base';
import { Svg, G, Rect } from 'react-native-svg';
import { ChartScrollView } from './ChartScrollView';
import { CandleXAxis } from './CandleXAxis';
import { CandleYAxis } from './CandleYAxis';
import { CandleTick } from './CandleTick';
import { TimeScale } from './TimeScale';
import { PriceScale } from './PriceScale';
import { GridLayout } from './GridLayout';
import { CANDLE_CONFIGS } from 'configs';

import { TypeCandle } from 'apis';
import { COLORS } from 'styles';
import { ScrollPosition } from './ChartScrollView';

const {
    ASPECT_RATIO,
    TICK_WIDTH,
    TIME_PADDING_IN_DAYS,
    X_HEIGHT,
    Y_WIDTH,
} = CANDLE_CONFIGS;

interface CandleChartProps {
    prices: TypeCandle[]
}

interface CandleChartState {
    displayWidth: number;
    displayHeight: number;
    boxWidth: number;
    boxHeight: number;
    contentWidth: number;
    contentHeight: number;
    timeScale: TimeScale | null,
    priceScale: PriceScale | null,
    scrollPositionX: number;
    scrollPositionY: number;
}

export class CandleChart extends React.PureComponent<
    CandleChartProps,
    CandleChartState
> {    
    state: CandleChartState = {
        displayWidth: 0,
        displayHeight: 0,
        boxWidth: 0,
        boxHeight: 0,
        contentWidth: 0,
        contentHeight: 0,
        timeScale: null,
        priceScale: null,
        scrollPositionX: 0,
        scrollPositionY: 0,
    }

    componentDidMount() {
        this.calcDisplayDimensions();
        if (this.props.prices.length) {
            this.calcContentParameters(() => {
                this.onScroll(this.getCurrentScrollPosition());
            });
        }
    }

    componentDidUdpate(prevProps: CandleChartProps) {
        if (prevProps.prices !== this.props.prices) {
            this.calcDisplayDimensions();
            this.calcContentParameters();
        }
    }

    calcDisplayDimensions = () => {
        const displayWidth = Dimensions.get('window').width;
        const displayHeight = displayWidth / ASPECT_RATIO;

        this.setState({
            displayWidth,
            displayHeight,
            boxWidth: displayWidth - Y_WIDTH,
            boxHeight: displayHeight - X_HEIGHT,
        });
    }

    calcContentParameters = (cb = () => {}) => {
        this.setState(({
            boxHeight,
            boxWidth,
            scrollPositionX,
            scrollPositionY,
        }) => {
            const { prices } = this.props;
            const contentWidth = (prices.length + 2 * TIME_PADDING_IN_DAYS - 1) * TICK_WIDTH;
            const contentHeight = contentWidth / ASPECT_RATIO;

            const timeScale = new TimeScale(
                prices,
                boxWidth,
                contentWidth
            );

            const priceScale = new PriceScale(
                prices,
                boxHeight,
                contentHeight
            );

            return {
                contentHeight,
                contentWidth,
                timeScale,
                priceScale,
            }
        }, cb);
    }

    onScroll = (position: ScrollPosition) => {
        this.setState(({ scrollPositionX, scrollPositionY }) => {

            const { contentWidth, boxWidth } = this.state;

            const x = Math.min(
                contentWidth - boxWidth,
                Math.max(0, position.x),
            );

            const isForward = x <= scrollPositionX;
    
            const y = this.findScrollYPosition(position.x, isForward);
        
            return {
                scrollPositionX: x,
                scrollPositionY: y === null ? scrollPositionY : y
            };
        });
    }

    findScrollYPosition = (
        x: number,
        isForward: boolean,
    ) => {
        const { timeScale, priceScale, contentWidth, contentHeight } = this.state;

        if (!timeScale || !priceScale) return null;

        const tick = timeScale.getPriceRangeFromPosition(
            contentWidth - x
        );

        if (!tick) return null;

        const y = priceScale.getScrollPosition(tick.min, tick.max);

        return y - 10;
    }

    getCurrentScrollPosition = (): ScrollPosition => ({
        x: this.state.scrollPositionX,
        y: this.state.scrollPositionY
    })

    render() {
        const { prices } = this.props;
        if (!prices.length) return null;

        const {
            scrollPositionX,
            scrollPositionY,
            displayHeight,
            displayWidth,
            boxHeight,
            boxWidth,
            contentHeight,
            contentWidth,
            timeScale,
            priceScale,
        } = this.state;

        return (
            <View style={styles.wrapper}>
                {/* <View style={styles.inner}> */}
                <ChartScrollView
                    style={styles.inner}
                    onScroll={this.onScroll}
                    getCurrentPosition={this.getCurrentScrollPosition}
                >
                    <Svg style={styles.svg}>
                        <G
                            x={boxWidth - contentWidth + scrollPositionX}
                            y={-scrollPositionY}
                        >
                            <GridLayout
                                timeScale={timeScale}
                                priceScale={priceScale}
                                contentHeight={contentHeight}
                                contentWidth={contentWidth}
                            />
                            
                            <G
                                x={0}
                                y={0}
                            >
                                {prices.map((price, index) => {
                                    // if (index % 10) return null;
                                    return (
                                        <CandleTick
                                            key={price.t}
                                            price={price}
                                            timeScale={timeScale}
                                            priceScale={priceScale}
                                        />
                                    );
                                })}
                            </G>

                            <CandleXAxis
                                x={0}
                                y={boxHeight + scrollPositionY}
                                contentWidth={contentWidth}
                                scale={timeScale}
                            />

                            <CandleYAxis
                                x={contentWidth - scrollPositionX}
                                y={0}
                                contentHeight={contentHeight}
                                scale={priceScale}
                            />
                            <Rect
                                x={contentWidth - scrollPositionX - 1}
                                y={boxHeight - 1 + scrollPositionY}
                                width={Y_WIDTH + 2}
                                height={X_HEIGHT + 2}
                                fill={COLORS.black}
                            />
                        </G>
                    </Svg>
                </ChartScrollView>
                {/* </View> */}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        paddingTop: `${100 / ASPECT_RATIO}%`,
        position: 'relative',
    },
    inner: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    svg: {
        width: '100%',
        height: '100%',
        // backgroundColor: 'white'
    }
});