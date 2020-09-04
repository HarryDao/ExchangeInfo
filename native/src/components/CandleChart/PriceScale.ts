import * as d3 from 'd3';
import { CANDLE_CONFIGS } from 'configs';

import { TypeCandle } from 'apis';

const {
    PRICE_UNITS_ON_SCREEN,
    PRICE_PADDING_IN_PERCENTAGES,
} = CANDLE_CONFIGS;

export interface PriceLabel {
    price: number;
    position: number;
}

export class PriceScale {
    private scale: d3.ScaleLinear<number, number>;
    private unit: number;
    private extent: [number, number];
    private labels: PriceLabel[];
    private boxHeight: number;
    private contentHeight: number;

    constructor(
        data: TypeCandle[],
        boxHeight: number,
        contentHeight: number,
    ) {
        const { unit, extent } = this.createExtent(
            data,
            boxHeight,
            contentHeight
        );
        const scale = this.createScale(contentHeight, extent);
        const labels = this.createLabels(scale, extent, unit);
        
        this.boxHeight = boxHeight;
        this.contentHeight = contentHeight;
        this.unit = unit;
        this.extent = extent;
        this.scale = scale;
        this.labels = labels;
    }

    private createExtent = (
        data: TypeCandle[],
        boxHeight: number,
        contentHeight: number,
    ): {
        unit: number;
        extent: [number, number];        
    } => {
        const flatted = data.reduce((arr: number[], d) => {
            arr.push(d.h, d.l);
            return arr;
        }, []);

        const [min, max] = d3.extent(flatted) as [number, number];
        const difference = max - min;
        const totalSteps = this.getTotalSteps(boxHeight, contentHeight);
        return this.calcPriceStep(
            min - difference * PRICE_PADDING_IN_PERCENTAGES / 100,
            max + difference * PRICE_PADDING_IN_PERCENTAGES / 100,
            totalSteps
        );
    }

    private getTotalSteps = (boxHeight: number, contentHeight: number) => {
        return PRICE_UNITS_ON_SCREEN * contentHeight / boxHeight;
    }

    private calcPriceStep = (
        min: number,
        max: number,
        totalSteps: number
    ): {
        unit: number;
        extent: [number, number];
    } => {
        const increment = (max - min) / totalSteps;
        
        let base = 1;
        let number = increment;
        while (number > 10 || number < 1) {
            if (number > 10) {
                base *= 10;
                number /= 10;
            } else if (number < 1) {
                base /= 10;
                number *= 10;
            }
        }
    
        const unit = Math.floor(number * 2) * (base / 2);
    
        return {
            unit,
            extent: [
                Math.floor(min / unit) * unit,
                Math.ceil(max / unit) * unit
            ],
        }
    }

    private createScale = (
        contentHeight: number,
        extent: [number, number]
    ): d3.ScaleLinear<number, number>  => {
        return d3.scaleLinear()
            .domain(extent)
            .range([contentHeight, 0]);
    };

    private createLabels = (
        scale: d3.ScaleLinear<number, number>,
        extent: [number, number],
        unit: number,
    ): PriceLabel[] => {
        const [min, max] = extent;
        const labels: PriceLabel[] = [];

        if (min >= max) return labels;

        for (
            let add = 0, total = (max - min) / unit;
            add < total;
            add ++
        ) {
            const price = min + unit * add;
            labels.push({
                price,
                position: scale(price)
            });
        }

        return labels;
    }

    getLabels = (): PriceLabel[] => this.labels;

    getPosition = (price: number): number => this.scale(price);

    getScrollPosition = (priceMin: number, priceMax: number): number => {
        const { scale, boxHeight} = this;
        const yMax = scale(priceMax);
        return yMax;
    }
}