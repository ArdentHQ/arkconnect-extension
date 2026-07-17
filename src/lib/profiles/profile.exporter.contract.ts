export interface IProfileExporter {
	/**
	 * Export the profile data to a base64 string.
	 *
	 * @param {string} [password]
	 * @return {string}
	 * @memberof Profile
	 */
	export(password?: string): Promise<string>;
}
