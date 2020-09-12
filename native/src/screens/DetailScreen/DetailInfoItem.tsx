import React, { memo } from 'react';
import { View, Text } from 'native-base';
import { StyleSheet } from 'react-native';
import { COLORS, TYPOS } from 'styles';

type Content = string | number;

interface DetailInfoItemProps {
    label: string;
    content: Content | Content[];
}

const _DetailInfoItem = ({
    label,
    content
}: DetailInfoItemProps) => {
    if (!Array.isArray(content)) content = [content];

    return (
        <View style={styles.info}>
            <Text style={styles.infoLabel}>
                {label.toUpperCase()}
            </Text>
            <View style={styles.infoContent}>
                {content.map((line, index) => {
                    return (
                        <Text 
                            key={index}
                            style={styles.infoContentLine}
                        >
                            {`${line}`.toUpperCase()}
                        </Text>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    info: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoLabel: {
        color: COLORS.grey_white,
        ...TYPOS.xsmall,
    },
    infoContent: {
        flex: 1,
    },
    infoContentLine: {
        ...TYPOS.xsmall,
        color: COLORS.white,
        textAlign: 'right',
        fontWeight: '600',
    }
});

export const DetailInfoItem = memo(_DetailInfoItem);