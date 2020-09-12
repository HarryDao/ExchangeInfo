import React from 'react';
import {
    StyleSheet,
    Dimensions,
    Animated,
    PanResponder,
    PanResponderInstance, RefreshControlBase
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
import { ScrollPosition, TouchPosition } from './ChartScrollView';

const {
    SCREEN_ASPECT_RATIO,
    CONTENT_ASPECT_RATIO,
    TICK_WIDTH,
    X_HEIGHT,
    Y_WIDTH,
} = CANDLE_CONFIGS;

interface CandleChartProps {
    prices: TypeCandle[],
    isPortrait: boolean,
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
    touchPositionX: number | null;
    touchPositionY: number | null;
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
        touchPositionX: null,
        touchPositionY: null,
    }

    componentDidMount() {
        this.calcDisplayDimensions();
        if (this.props.prices.length) {
            this.calcContentParameters(() => {
                this.onScroll(this.getCurrentScrollPosition());
            });
        }
    }

    componentDidUpdate(prevProps: CandleChartProps) {
        if (
            prevProps.prices !== this.props.prices ||
            prevProps.isPortrait !== this.props.isPortrait
        ) {
            this.calcDisplayDimensions();
            this.calcContentParameters();
        }
    }

    calcDisplayDimensions = () => {
        const { isPortrait } = this.props;

        const { width, height } = Dimensions.get('window');
        const displayHeight = isPortrait
            ? (width / SCREEN_ASPECT_RATIO)
            : height;

        this.setState({
            displayWidth: width,
            displayHeight,
            boxWidth: width - Y_WIDTH,
            boxHeight: displayHeight - X_HEIGHT,
        });
    }

    calcContentParameters = (cb = () => {}) => {
        this.setState(({
            boxHeight,
            boxWidth,
        }) => {
            const { prices } = this.props;
            const contentWidth = (prices.length - 1) * TICK_WIDTH + boxWidth;
            const contentHeight = contentWidth / CONTENT_ASPECT_RATIO;

            const timeScale = new TimeScale(
                boxWidth,
                contentWidth,
                prices,
            );

            const priceScale = new PriceScale(
                boxHeight,
                contentHeight,
                prices,
            );

            return {
                contentHeight,
                contentWidth,
                timeScale,
                priceScale,
            }
        }, cb);
    }

    onScroll = (scrollPosition: ScrollPosition, touchPosition?: TouchPosition) => {
        const { x, y } = this.findScrollPosition(scrollPosition);

        this.setState({
            scrollPositionX: x,
            scrollPositionY: y,
            touchPositionX: touchPosition ? touchPosition.x : null,
            touchPositionY: touchPosition ? touchPosition.y : null,
        });
    }

    findScrollPosition = (position: ScrollPosition): {
        x: number;
        y: number;
    } => {
        const {
            contentWidth,
            contentHeight,
            boxWidth,
            timeScale,
            priceScale,
            boxHeight
        } = this.state;

        const x = Math.min(
            contentWidth - boxWidth,
            Math.max(0, position.x)
        ); 
        const scroll = {
            x,
            y: position.y
        };

        if (!timeScale || !priceScale) return scroll;

        const midX = contentWidth - x - boxWidth / 2;
        const tick = timeScale.getTickFromPosition(midX);

        if (!tick) return scroll;

        const midY = priceScale.getPositionFromTimeTick(tick);
       
        if (midY === null) return scroll;

        scroll.y = Math.min(
            contentHeight - boxHeight,
            Math.max(midY - boxHeight / 2, 0)
        );

        return scroll;
    }

    getCurrentScrollPosition = (): ScrollPosition => ({
        x: this.state.scrollPositionX,
        y: this.state.scrollPositionY
    })

    render() {
        const { prices } = this.props;
        if (!prices.length) return null;

        const { isPortrait } = this.props;
        const {
            displayWidth,
            displayHeight,
            scrollPositionX,
            scrollPositionY,
            boxHeight,
            boxWidth,
            contentHeight,
            contentWidth,
            timeScale,
            priceScale,
            touchPositionX,
            touchPositionY,
        } = this.state;

        const baseX = boxWidth - contentWidth + scrollPositionX;
        const baseY = -scrollPositionY;
        const touchX = touchPositionX === null ?
            null :
            (touchPositionX - baseX);
        const touchY = touchPositionY === null ?
            null :
            (touchPositionY - baseY);

        let wrapperStyles: { [key: string]: any } = styles.wrapper;
        if (!isPortrait) {
            wrapperStyles = {
                position: styles.wrapper.position,
                width: displayWidth,
                paddingTop: displayHeight,
            };
        }

        return (
            <View style={wrapperStyles}>
                <ChartScrollView
                    style={styles.inner}
                    onScroll={this.onScroll}
                    getCurrentPosition={this.getCurrentScrollPosition}
                >
                    <Svg style={styles.svg}>
                        <G
                            x={baseX}
                            y={baseY}
                        >
                            <GridLayout
                                timeScale={timeScale}
                                priceScale={priceScale}
                                contentHeight={contentHeight}
                                contentWidth={contentWidth}
                                touchX={touchX}
                                touchY={touchY}
                            />
                            
                            <G
                                x={0}
                                y={0}
                            >
                                {prices.map((price) => {
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
                                touchX={touchX}
                            />

                            <CandleYAxis
                                x={contentWidth - scrollPositionX}
                                y={0}
                                contentHeight={contentHeight}
                                scale={priceScale}
                                touchY={touchY}
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
            </View>
        );
    }
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        paddingTop: `${100 / SCREEN_ASPECT_RATIO}%`,
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
    }
});