import moment from 'moment';
import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { View, Container, Content, Text, Spinner } from 'native-base';
import { fetchDetail } from 'actions';
import { CandleChart } from 'components';
import { COLORS, TYPOS } from 'styles';
import { DetailScreenHeader } from './DetailScreenHeader';
import { DetailInfoItem } from './DetailInfoItem';

import { StoreState } from 'reducers';
import { DetailScreenNavProps } from 'screens';
import { TypeHistoricalPrices, EntityTypes, TypeExchangeEntity } from 'apis';

interface DetailsScreenProps extends DetailScreenNavProps {
    data: TypeHistoricalPrices,
    loading: boolean,
    error: boolean,
    type: EntityTypes,
    name: string,
    symbol: string, 
    fetchDetail: (entity: TypeExchangeEntity) => any,  
};

class _DetailScreen extends React.PureComponent<DetailsScreenProps> {
    componentDidMount() {
        this.fetch();
    }

    componentDidUpdate(prevProps: DetailsScreenProps) {
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
        const name = this.formatName(this.props.name);
        const prices = data[symbol] && data[symbol].prices || [];

        return (
            <Container style={styles.wrapper}>
                <Content
                    alwaysBounceVertical={false}
                >
                    <DetailScreenHeader
                        onBackPress={this.onBackPress}
                        name={name}
                        symbol={symbol}
                    />
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
                            />
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
                                {!prices[0] ? null : (
                                    <DetailInfoItem
                                        label='last price'
                                        content={[
                                            prices[0].c,
                                            `(${(moment(prices[0].t * 1000).format(`DD MMM, HH:mm:SS`))})`
                                        ]}
                                    />
                                )}
                            </View>
                        </View>
                    )}
                </Content>
            </Container>
        );        
    }
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.black
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
        overflow: 'hidden'
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