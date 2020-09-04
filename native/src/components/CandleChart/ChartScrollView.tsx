import React from 'react';
import { Animated, PanResponderInstance, PanResponder } from 'react-native';

export interface ScrollPosition {
    x: number;
    y: number;
}

interface ChartScrollViewProps {
    style?: any;
    children: any;
    onScroll: (position: ScrollPosition) => any;
    getCurrentPosition: () => ScrollPosition;
}

export class ChartScrollView extends React.PureComponent<ChartScrollViewProps> {
    scrollPosition = new Animated.ValueXY();
    scrollResponder?: PanResponderInstance;

    componentDidMount() {
        const { onScroll, getCurrentPosition } = this.props;

        this.scrollPosition.addListener(onScroll);

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
            onPanResponderMove: Animated.event([
                null,
                {
                    dx: this.scrollPosition.x,
                    dy: this.scrollPosition.y
                }
            ]),
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