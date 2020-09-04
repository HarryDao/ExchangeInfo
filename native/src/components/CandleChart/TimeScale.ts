import _cloneDeep from 'lodash/cloneDeep';
import * as d3 from 'd3';
import moment from 'moment';
import { CANDLE_CONFIGS } from 'configs';

import { TimeInSeconds, TypeCandle, TypePrice } from 'apis';
import { Moment } from 'moment';
import cloneDeep from 'lodash/cloneDeep';

const {
    TIME_PADDING_IN_DAYS,
    TIME_UNITS_ON_SCREEN,
} = CANDLE_CONFIGS;

export interface TimeLabel {
    date: Moment;
    position: number;
}

type TimeInMs = number;

export interface TypePriceExtentTick {
    time: TimeInMs;
    min: number;
    max: number;
}

export class TimeScale {
    private contentWidth: number;
    private boxWidth: number;
    private ticks: TypePriceExtentTick[];
    private labels: TimeLabel[];
    private extent: [Moment, Moment];
    private scale: d3.ScaleLinear<number, number>;

    constructor(
        data: TypeCandle[],
        boxWidth: number,
        contentWidth: number,
    ) {
        const ticks = this.getPriceExtentTicks(data, boxWidth, contentWidth);
        const extent = this.getTimeExtent(data);
        const scale = this.createScale(extent, contentWidth);
        const labels = this.createLabels(
            data,
            boxWidth,
            contentWidth,
            scale
        );

        this.contentWidth = contentWidth;
        this.boxWidth = boxWidth;
        this.ticks = ticks;
        this.labels = labels;
        this.extent = extent;
        this.scale = scale;
    }

    private getTimeExtent = (
        data: TypeCandle[],
    ): [Moment, Moment] => {
        const dates = data.map(price => moment(price.t * 1000));

        const extent = d3.extent(dates) as [Moment, Moment];

        const min = moment(extent[0]).subtract(
            TIME_PADDING_IN_DAYS,
            'day'
        );
        const max = moment(extent[1]).add(
            TIME_PADDING_IN_DAYS,
            'day'
        );

        return [min, max];
    }

    private createScale = (
        extent: [Moment, Moment],
        contentWidth: number,
    ): d3.ScaleLinear<number, number> => {
        return  d3.scaleLinear()
            .domain(extent.map(m => m.valueOf()))
            .range([0, contentWidth]);
    }

    // private getPriceExtentTick = (
    //     data: TypeCandle[],
    //     boxWidth: number,
    //     contentWidth: number
    // ): TypePriceExtentTick[] => {
    //     const step = Math.floor((data.length + 2 * TIME_PADDING_IN_DAYS) * boxWidth / contentWidth);

    // }

    private getPriceExtentTicks = (input: TypeCandle[], boxWidth: number, contentWidth: number): TypePriceExtentTick[] => {
        const data = cloneDeep(input).sort((a, b) => a.t < b.t ? -1 : 1);

        const step = Math.floor((data.length + 2 * TIME_PADDING_IN_DAYS) * boxWidth / contentWidth);   

        const { length } = data;
        const minLeft: number[] = [];
        const minRight: number[] = [];
        const maxLeft: number[] = [];
        const maxRight: number[] = [];
    
        let tempMin: number | null = null;
        let tempMax: number | null = null;
    
        for (let index = 0; index < length; index ++) {
            const { h, l } = data[index];
    
            if(index % step === 0) {
                tempMin = null;
                tempMax = null;
            }
            
            if (tempMin === null || l < tempMin) {
                tempMin = l;
            }
            minLeft.push(tempMin as number);
    
            if (tempMax === null || h > tempMax) {
                tempMax = h;
            }
            maxLeft.push(tempMax as number);
        }
    
        tempMax = null;
        tempMin = null;
    
        for (let index = length - 1; index >= 0; index --) {
            const { h, l } = data[index];
    
            if (tempMin === null || l < tempMin) {
                tempMin = l;
            }
            minRight.push(tempMin as number);
    
            if (tempMax === null || h > tempMax) {
                tempMax = h;
            }
            maxRight.push(tempMax as number);
    
            if (index % step === 0) {
                tempMax = null;
                tempMin = null;
            }
        }
    
        minRight.reverse();
        maxRight.reverse();

        const ticks: TypePriceExtentTick[] = [];

        for (let leftIndex = 0; leftIndex < length; leftIndex ++) {
            const rightIndex = leftIndex - step + 1;
            let min = 0;
            let max = 0;
    
            if (rightIndex < 0) {
                max = maxLeft[leftIndex];
                min = minLeft[leftIndex];
            } else {
                max = Math.max(maxLeft[leftIndex], maxRight[rightIndex]);
                min = Math.min(minLeft[leftIndex], minRight[rightIndex]);
            }
    
            ticks.push({
                min,
                max,
                time: data[leftIndex].t * 1000
            });
        }
    
        return ticks;
    }

    private createLabels = (
        data: TypeCandle[],
        boxWidth: number,
        contentWidth: number,
        scale: d3.ScaleLinear<number, number>,
    ): TimeLabel[] => {
        const totalUnits = TIME_UNITS_ON_SCREEN * contentWidth / boxWidth;
        const tickSpans = data.length + 2 * TIME_PADDING_IN_DAYS;
        const span = Math.floor(tickSpans / totalUnits);

        const labels: TimeLabel[] = [];
        
        for (let index = 0, length = data.length; index < length; index ++) {
            if (index % span === 0) {
                const date = moment(data[index].t * 1000);

                labels.push({
                    date,
                    position: scale(date.valueOf())
                });
            }
        }
        
        return labels;
    }

    getExtent = (): [Moment, Moment] => this.extent;

    getLabels = (): TimeLabel[] => this.labels;

    getPosition = (input: TimeInSeconds | Moment): number => {
        if (typeof input === 'number') {
            return this.scale(moment(input * 1000).valueOf());
        }
    
        return this.scale(input.valueOf());
    }

    getTimeFromPosition = (position: number): number => {
        return this.scale.invert(position)
    }

    getPriceRangeFromPosition = (position: number): TypePriceExtentTick | null => {
        const time = this.getTimeFromPosition(position);
        return this.getTickForTime(time);
    }

    private getTickForTime = (time: number): TypePriceExtentTick | null => {
        const { ticks } = this;

        if (!ticks.length) return null;

        const earliestTick = ticks[0];
        const latestTick = ticks[ticks.length - 1];

        if (time >= latestTick.time) {
            return latestTick;
        } else if (time <= earliestTick.time) {
            return earliestTick;
        }

        let startIndex = 0;
        let endIndex = ticks.length - 1;
        
        while (startIndex <= endIndex) {
            if (startIndex === endIndex) {
                return ticks[startIndex];
            }
    
            const midIndex = Math.floor((startIndex + endIndex) / 2);
            const mid = ticks[midIndex];
    
            if (time <= mid.time && time >= ticks[midIndex - 1].time) {
                return mid;
            } else if (time > mid.time) {
                startIndex = midIndex + 1;
            } else {
                endIndex = midIndex;
            }
        }

        return null;
    }
}