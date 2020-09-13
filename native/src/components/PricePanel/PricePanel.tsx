import React from 'react';
import { StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { Button, Text, View } from 'native-base';
import { COLORS, TYPOS } from 'styles';
import { MainStackNavContext } from 'context';
import { LineChart } from '../LineChart';
import { PriceDifference } from '../PriceDifference';
import { formatName } from 'helpers';

import { TypePrice, TypeHistoricalPrice } from 'apis';

interface PricePanelProps {
    price: TypePrice;
    history?: TypeHistoricalPrice;
    historyLoading?: boolean;
    index: number;
    hide?: any;
};

interface PricePanelState {
    priceDifference: number;
}

export class PricePanel extends React.PureComponent<
    PricePanelProps,
    PricePanelState
> {
    static contextType = MainStackNavContext;
    context!: React.ContextType<typeof MainStackNavContext>;

    state = { priceDifference: 0 }

    componentDidUpdate(prevProps: PricePanelProps) {
        if (prevProps.price.p !== this.props.price.p) {
            this.highlightPriceDifference(
                this.props.price.p - prevProps.price.p
            );
        }
    }

    highlightPriceDifference = (difference: number) => {
        this.setState({ priceDifference: difference }, () => {
            setTimeout(() => {
                this.setState({ priceDifference: 0 });
            }, 1000);
        });
    }

    onButtonPress = () => {
        const { navigation } = this.context;
        const { price } = this.props;
        const { s, type, name } = price;
        
        if (navigation) {
            navigation.push('DetailScreen', {
                symbol: s,
                type,
                name,
            });
        }
    }

    render() {
        const { price, history, hide, historyLoading } = this.props;
        const {
            type,
            p,
            s,
        } = price;
        const name = formatName(price.name);

        const { priceDifference } = this.state;
        
        let priceStyle = styles.price;

        if (priceDifference > 0) {
            priceStyle = {
                ...priceStyle,
                ...styles.priceUp,
            }
        } else if (priceDifference < 0) {
            priceStyle = {
                ...priceStyle,
                ...styles.priceDown
            }
        }

        return (
            <Animated.View
                style={{
                    ...styles.wrapper,
                    ...(hide ? styles.wrapperHide : {})
                }}
            >
                <Button
                    style={styles.button}
                    onPress={this.onButtonPress}
                >
                    <View style={styles.left}>
                        <Text style={styles.symbol}>{name}</Text>
                        <Text style={priceStyle}>{p.toPrecision(8)}</Text>
                    </View>
                    <View style={styles.right}>
                        {historyLoading && (
                            <ActivityIndicator
                                size='small'
                            />
                        )}
                        
                        {!historyLoading && (
                            <React.Fragment>
                                <PriceDifference
                                    last={
                                        history && history.prices ?
                                            history.prices[0].c :
                                            null
                                    }
                                    current={p}
                                />
                                <LineChart
                                    history={history}
                                    current={p}
                                />
                            </React.Fragment>
                        )}
                    </View>
                </Button>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    wrapperHide: {
        display: 'none',
    },
    button: {
        backgroundColor: COLORS.black_light,
        height: 'auto',
        alignItems: 'stretch',
    },
    left: {
        width: '50%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    right: {
        width: '50%',
        minHeight: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    symbol: {
        color: COLORS.aqua,
        fontWeight: '600',
        ...TYPOS.normal
    },
    price: {
        color: COLORS.white,
        fontWeight: '600',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
        ...TYPOS.smedium,
    },
    priceUp: {
        backgroundColor: COLORS.green,
    },
    priceDown: {
        backgroundColor: COLORS.red,
    }
});