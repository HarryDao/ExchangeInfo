import * as d3 from 'd3';
import { CANDLE_CONFIGS } from 'configs';
import { TypeCandle } from 'apis';
import { TimeTick } from './TimeScale';

const {
    PRICE_UNITS_ON_SCREEN,
    PRICE_PADDING_IN_PERCENTAGES,
} = CANDLE_CONFIGS;

export interface PriceLabel {
    price: number;
    position: number;
}

export class PriceScale {
    private unit: number = 0;
    private extent: [number, number] | null = null;
    private scale: d3.ScaleLinear<number, number> | null = null;
    private labels: PriceLabel[] = [];

    constructor(
        private boxHeight: number,
        private contentHeight: number,
        data: TypeCandle[],
    ) {
        this.createExtentAndUnit(data);
        this.createScale();
        this.createLabels();
    }

    private createExtentAndUnit = (data: TypeCandle[]) => {
        const { boxHeight, contentHeight } = this;
        const totalSteps =  PRICE_UNITS_ON_SCREEN * contentHeight / boxHeight;

        const flatted = data.reduce((arr: number[], d) => {
            arr.push(d.h, d.l);
            return arr;
        }, []);

        const [rawMin, rawMax] = d3.extent(flatted) as [number, number];
        const difference = rawMax - rawMin;
        const min = rawMin - difference * PRICE_PADDING_IN_PERCENTAGES / 100;
        const max = rawMax + difference * PRICE_PADDING_IN_PERCENTAGES / 100;
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

        this.unit = unit;
        this.extent = [
            Math.floor(min / unit) * unit,
            Math.ceil(max / unit) * unit
        ];
    }

    private createScale = () => {
        const { contentHeight, extent } = this;

        if (!extent) return;

        this.scale = d3.scaleLinear()
            .domain(extent)
            .range([contentHeight, 0]);
    }

    private createLabels = () => {
        const { unit, extent, scale } = this;

        if (!extent || !scale) return;

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

        this.labels = labels;
    };

    getLabels = (): PriceLabel[] => this.labels;

    getPositionFromPrice = (price: number): number | null => {
        return this.scale ? this.scale(price) : null;
    };

    getPositionFromTimeTick = (tick: TimeTick): number | null => {
        const { h, l } = tick;
        const midPrice = (h + l) / 2;
        
        return this.getPositionFromPrice(midPrice);
    }

    getPriceFromPosition = (position: number): number | null => {
        return this.scale ? this.scale.invert(position) : null;
    }
}