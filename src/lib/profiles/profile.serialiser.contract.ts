import { IProfileData } from "./contracts.js";

export interface IProfileSerialiser {
	/**
	 * Normalise the profile into an object.
	 *
	 * @return {IProfileData}
	 * @memberof Profile
	 */
	toJSON(): IProfileData;
}
