import moment from 'moment';
import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Subscription } from '@unimodules/core';
import { connect } from 'react-redux';
import { View, Container, Content, Text, Spinner } from 'native-base';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { fetchDetail } from 'actions';
import { CandleChart } from 'components';
import { COLORS, TYPOS } from 'styles';
import { DetailScreenHeader } from './DetailScreenHeader';
import { DetailInfoItem } from './DetailInfoItem';

import { StoreState } from 'reducers';
import { DetailScreenNavProps } from 'screens';
import { TypeHistoricalPrices, EntityTypes, TypeExchangeEntity } from 'apis';
import { DEFAULT_PEGGING_CURRENCY } from 'configs';

interface DetailsScreenProps extends DetailScreenNavProps {
    data: TypeHistoricalPrices,
    loading: boolean,
    error: boolean,
    type: EntityTypes,
    name: string,
    symbol: string, 
    fetchDetail: (entity: TypeExchangeEntity) => any,  
};

interface DetailsScreenState {
    isPortrait: boolean;
}

const INITIAL_STATE: DetailsScreenState = {
    isPortrait: true
}

class _DetailScreen extends React.PureComponent<DetailsScreenProps, DetailsScreenState> {
    orientationSubscription?: Subscription;

    state = INITIAL_STATE;

    componentDidMount() {
        this.fetch();

        ScreenOrientation.unlockAsync().then(d => {
            this.orientationSubscription =  ScreenOrientation.addOrientationChangeListener(
                this.onOrientationData
            );
        });
    }

    componentWillUnmount() {
        if (this.orientationSubscription) {
            ScreenOrientation.removeOrientationChangeListener(this.orientationSubscription);
        }
    }

    onOrientationData = ({ orientationInfo }: ScreenOrientation.OrientationChangeEvent) => {
        this.setState({
            isPortrait: orientationInfo.orientation !== 3 && orientationInfo.orientation !== 4
        });
    }

    componentDidUpdate() {
        this.fetch();
    }

    fetch = () => {
        const {
            route: {
                params
            },
            symbol,
            fetchDetail,
        } = this.props;

        if (params.symbol && params.symbol !== symbol) {
            fetchDetail(params);
        }

    }

    onBackPress = () => {
        this.props.navigation.goBack();
    }

    formatName = (name: string) => {
        if (!name) return name;
        const words = name.split('_')
            .map(w => {
                const chrs = w.split('');
                chrs[0] = chrs[0].toUpperCase();
                return chrs.join('');
            });
        return words.join(' ');
    }

    renderLoading = () => {
        if (this.props.loading) {
            return (
                <View>

                </View>
            );
        }
    }

    render() {
        const {
            data,
            loading,
            error,
            type,
            symbol,
        } = this.props;
        const { isPortrait } = this.state;
        
        const name = this.formatName(this.props.name);
        const unit = this.props.name.split('/')[1] || DEFAULT_PEGGING_CURRENCY;
        const prices = data[symbol] && data[symbol].prices || [];
        
        return (
            <SafeAreaView style={styles.wrapper}>
                <Container style={styles.container}>
                    <StatusBar hidden/>
                    <Content
                        scrollEnabled={false}
                    >
                        {isPortrait && (
                            <DetailScreenHeader
                                onBackPress={this.onBackPress}
                                name={name}
                                symbol={symbol}
                            />
                        )}
                        {loading && (
                            <View style={styles.loaderWrapper}>
                                <Spinner
                                    size='large'
                                    style={styles.loader}
                                    color={COLORS.white}
                                />
                                <Text style={styles.loaderText}>
                                    Fetching data ...
                                </Text>
                            </View>
                        )}
                        {!loading && (
                            <View style={styles.chartWrapper}>
                                <CandleChart
                                    prices={prices}
                                    isPortrait={isPortrait}
                                />
                                {isPortrait && (
                                    <View style={styles.infoWrapper}>
                                        {!symbol ? null : (
                                            <DetailInfoItem
                                                label='ticker'
                                                content={[symbol]}
                                            />
                                        )}
                                        {!type ? null : (
                                            <DetailInfoItem
                                                label='type'
                                                content={type}
                                            />
                                        )}
                                        {!unit ? null : (
                                            <DetailInfoItem
                                                label='unit currency'
                                                content={unit}
                                            />                         
                                        )}
                                        {!prices[0] ? null : (
                                            <React.Fragment>
                                                <DetailInfoItem
                                                    label='last open'
                                                    content={[
                                                        prices[0].o.toPrecision(5),
                                                    ]}
                                                />
                                                                                                                                        <DetailInfoItem
                                                    label='last close'
                                                    content={[
                                                        prices[0].c.toPrecision(5),
                                                    ]}
                                                />

                                                <DetailInfoItem
                                                    label='last high'
                                                    content={[
                                                        prices[0].h.toPrecision(5),
                                                    ]}
                                                />

                                                <DetailInfoItem
                                                    label='last low'
                                                    content={[
                                                        prices[0].l.toPrecision(5),
                                                    ]}
                                                />
                                            </React.Fragment>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}
                    </Content>
                </Container>
            </SafeAreaView>
        );        
    }
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.black,
        flex: 1,
    },
    container: {
        backgroundColor: COLORS.black,
    },
    loaderWrapper: {
        alignItems: 'center',
    },
    loader: {
        marginTop: 10,
        color: COLORS.white,
    },
    loaderText: {
        color: COLORS.white,
    },
    chartWrapper: {
        overflow: 'hidden',
    },
    infoWrapper: {
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
});

const mapStateToProps = ({ detail }: StoreState) => {
    return {
        data: detail.data,
        loading: detail.loading,
        error: detail.error,
        type: detail.type,
        name: detail.name,
        symbol: detail.symbol,
    }
}

export const DetailScreen = connect(
    mapStateToProps,
    {
        fetchDetail
    }    
)(_DetailScreen);