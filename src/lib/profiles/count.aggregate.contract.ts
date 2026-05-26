/**
 * Defines the implementation contract for the count aggregate.
 *
 * @export
 * @interface ICountAggregate
 */
export interface ICountAggregate {
	/**
	 * Count how many wallets there are in the current profile.
	 *
	 * @return {number}
	 * @memberof ICountAggregate
	 */
	wallets(): number;
}
