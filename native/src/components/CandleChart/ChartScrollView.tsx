import { eventNames } from 'process';
import React from 'react';
import { Animated, PanResponderInstance, PanResponder } from 'react-native';
import { composeWithDevTools } from 'redux-devtools-extension';

export interface ScrollPosition {
    x: number;
    y: number;
}

export interface TouchPosition {
    x: number | null;
    y: number | null;
}

interface ChartScrollViewProps {
    style?: any;
    children: any;
    onScroll: (scrollPosition: ScrollPosition, touchPosition: TouchPosition) => any;
    getCurrentPosition: () => ScrollPosition;
}

export class ChartScrollView extends React.PureComponent<ChartScrollViewProps> {
    scrollPosition = new Animated.ValueXY();
    scrollResponder?: PanResponderInstance;

    currentTouch: TouchPosition = { x: null, y: null }

    componentDidMount() {
        const { onScroll, getCurrentPosition } = this.props;

        this.scrollPosition.addListener((coords) => {
            onScroll(coords, this.currentTouch);
        });

        this.scrollResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,

            onPanResponderGrant: () => {
                this.scrollPosition.setOffset(getCurrentPosition());
                this.scrollPosition.setValue({
                    x: 0,
                    y: 0
                });
            },

            onPanResponderMove: (evt, gestureState) => {
                this.currentTouch = {
                    x: evt.nativeEvent.locationX,
                    y: evt.nativeEvent.locationY
                }

                return Animated.event([
                    null,
                    {
                        dx: this.scrollPosition.x,
                        dy: this.scrollPosition.y
                    }
                ], {
                    useNativeDriver: false
                })(evt, gestureState);
            },

            onPanResponderRelease: () => {
                this.scrollPosition.flattenOffset();
            }
        });
    }

    render() {
        const { children, style } = this.props;
        const handlers = this.scrollResponder 
            ? this.scrollResponder.panHandlers 
            : {};

        return (
            <Animated.View
                style={style || {}}
                {...handlers}
            >
                {children}
            </Animated.View>
        );
    }
}