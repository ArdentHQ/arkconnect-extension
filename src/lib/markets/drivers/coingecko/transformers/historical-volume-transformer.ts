import { DateTime } from '@/lib/intl';
import { HistoricalData, HistoricalTransformer } from '@/lib/markets/contracts';

/**
 * Implements a transformer for historical volume data.
 *
 * @export
 * @class HistoricalVolumeTransformer
 * @implements {HistoricalTransformer}
 */
export class HistoricalVolumeTransformer implements HistoricalTransformer {
    /**
     * Creates an instance of HistoricalVolumeTransformer.
     *
     * @param {Record<string, any>} data
     * @memberof HistoricalVolumeTransformer
     */
    public constructor(private readonly data: Record<string, any>) {}

    /**
     * Transforms the given data into a normalised format.
     *
     * @param {Record<string, any>} options
     * @returns {HistoricalData}
     * @memberof HistoricalVolumeTransformer
     */
    public transform(options: Record<string, any>): HistoricalData {
        const datasets: Record<string, any> = {};

        for (let index = 0; index < this.data.total_volumes.length; index += 24) {
            datasets[this.data.total_volumes[index][0]] = this.data.total_volumes[index][1];
        }

        const datasetValues: number[] = Object.values(datasets);

        return {
            datasets: datasetValues,
            labels: Object.keys(datasets).map((time) =>
                DateTime.make(time).format(options.dateFormat),
            ),
            max: Math.max(...datasetValues),
            min: Math.min(...datasetValues),
        };
    }
}
