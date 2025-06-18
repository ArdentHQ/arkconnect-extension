import { DateTime } from '@/lib/intl';
import { HistoricalData, HistoricalTransformer } from '@/lib/markets/contracts';

/**
 *  Implements a transformer for historical volume data.
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
        const datasets = this.data.map((value: any) => value.volumeto);

        return {
            datasets,
            labels: this.data.map((value: any) =>
                DateTime.make(value.time * 1000).format(options.dateFormat),
            ),
            max: Math.max(...datasets),
            min: Math.min(...datasets),
        };
    }
}
