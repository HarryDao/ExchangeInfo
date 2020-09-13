import * as d3 from 'd3';
import moment from 'moment';
import { CANDLE_CONFIGS } from 'configs';

import { TimeInSeconds, TypeCandle } from 'apis';
import { Moment } from 'moment';

const {
    TIME_UNITS_ON_SCREEN,
    TICK_WIDTH,
    TICK_PADDING_IN_UNIT_OF_SCREEN_WIDTH,
} = CANDLE_CONFIGS;

export interface TimeLabel {
    date: Moment;
    position: number;
}

export interface TimeTick extends TypeCandle {
    date: Moment;
}

export class TimeScale {
    private ticks: TimeTick[] = [];
    private labels: TimeLabel[] = [];
    private extent: [Moment, Moment] | null = null;
    private scale: d3.ScaleLinear<number, number> | null = null;
    private paddingInTicks: number = 0;

    constructor(
        private boxWidth: number,
        private contentWidth: number,
        data: TypeCandle[],
    ) {
        this.paddingInTicks = Math.floor(
            boxWidth * TICK_PADDING_IN_UNIT_OF_SCREEN_WIDTH / TICK_WIDTH
        );

        this.createTicks(data);
        this.createTimeExtent();
        this.createScale();
        this.createLabels();
    }

    private createTicks = (data: TypeCandle[]) => {
        this.ticks = data
            .map(candle => {
                return {
                    ...candle,
                    date: moment(candle.t * 1000)
                }
            })
            .sort((a, b) => a.t < b.t ? -1 : 1);
    };

    private createTimeExtent = () => {
        const { ticks, paddingInTicks } = this;
        const [rawMin, rawMax] = d3.extent(ticks.map(tick => tick.date)) as [Moment, Moment];


        const min = moment(rawMin).subtract(
            paddingInTicks,
            'day'
        );
        const max = moment(rawMax).add(
            paddingInTicks,
            'day'
        );

        this.extent =[min, max];
    }

    private createScale = () => {
        const { extent, contentWidth } = this;

        if (extent) {
            this.scale = d3.scaleLinear()
                .domain(extent.map(m => m.valueOf()))
                .range([0, contentWidth]);
        }
    };

    private createLabels = () => {
        const { ticks, scale, boxWidth, contentWidth, paddingInTicks } = this;

        if (!scale) return;

        const totalUnits = TIME_UNITS_ON_SCREEN * contentWidth / boxWidth;
        const tickSpans = ticks.length + 2 * paddingInTicks - 1;
        const spanInTickUnits = Math.floor(tickSpans / totalUnits);

        const labels: TimeLabel[] = [];

        for (let index = ticks.length - 1; index >= 0; index --) {
            if (
                (ticks.length - 1 - index) % spanInTickUnits === 0
            ) {
                const { date } = ticks[index];
                labels.push({
                    date,
                    position: scale(date.valueOf())
                });
            }
        }
        
        this.labels = labels;       
    }


    getExtent = (): [Moment, Moment] | null => this.extent;

    getLabels = (): TimeLabel[] => this.labels;

    getPosition = (input: TimeInSeconds | Moment): number | null => {
        if (!this.scale) return null;

        if (typeof input === 'number') {
            return this.scale(input * 1000);
        }
    
        return this.scale(input.valueOf());
    }

    getTimeFromPosition = (position: number): number | null => {
        return this.scale ? this.scale.invert(position) : null;
    }

    getTickFromPosition = (position: number): TimeTick | null => {
        const timeInMs = this.getTimeFromPosition(position);

        if (timeInMs === null) return null;

        return this.getTickFromTime(timeInMs);
    } 

    getTickFromTime = (timeInMs: number): TimeTick | null => {
        const { ticks } = this;

        if (!ticks.length) return null;

        const date = moment(timeInMs);
        const earliestTick = ticks[0];
        const latestTick = ticks[ticks.length - 1];


        if (date >= latestTick.date) {
            return latestTick;
        } else if (date <= earliestTick.date) {
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
    
            if (date <= mid.date && date >= ticks[midIndex - 1].date) {
                return mid;
            } else if (date > mid.date) {
                startIndex = midIndex + 1;
            } else {
                endIndex = midIndex;
            }
        }

        return null;
    }
}