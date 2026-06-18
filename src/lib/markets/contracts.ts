export interface HistoricalData {
    labels: string[];
    datasets: number[];
    min: number;
    max: number;
}

export interface HistoricalPriceOptions {
    token: string;
    currency: string;
    days: number;
    type: string;
    dateFormat: string;
}

export interface DailyAverageOptions {
    token: string;
    currency: string;
    timestamp: number;
}

export interface PriceTracker {
    historicalPrice(options: HistoricalPriceOptions): Promise<HistoricalData>;
    dailyAverage(options: DailyAverageOptions): Promise<number>;
}
