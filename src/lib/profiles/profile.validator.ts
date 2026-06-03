import Joi from "joi";

import { IProfileData, IProfileValidator, ProfileData, ProfileSetting } from "./contracts.js";

export class ProfileValidator implements IProfileValidator {
	/**
	 * Validate the profile data.
	 *
	 * @param {IProfileData} [data]
	 * @return {Promise<IProfileData>}
	 * @memberof Profile
	 */
	public validate(data: IProfileData): IProfileData {
		const { error, value } = Joi.object({
			data: Joi.object({
				[ProfileData.LatestMigration]: Joi.string(),
				[ProfileData.MigrationResult]: Joi.object({
					coldAddresses: Joi.array(),
					mergedAddresses: Joi.array(),
				}),
				[ProfileData.HasCompletedIntroductoryTutorial]: Joi.boolean(),
				[ProfileData.HasAcceptedManualInstallationDisclaimer]: Joi.boolean(),
				[ProfileData.WhitelistedContractAddresses]: Joi.array(),
			}).required(),
			hosts: Joi.object().default({}),
			id: Joi.string().required(),
			networks: Joi.object().default({}),
			pendingMusigWallets: Joi.object().pattern(
				Joi.string().uuid(),
				Joi.object({
					data: Joi.object().required(),
					id: Joi.string().required(),
					settings: Joi.object().required(),
				}),
			),

			// @TODO: assert specific values for enums
			settings: Joi.object({
				[ProfileSetting.AutomaticSignOutPeriod]: Joi.number().required(),
				[ProfileSetting.Avatar]: Joi.string(),
				[ProfileSetting.Bip39Locale]: Joi.string().required(),
				[ProfileSetting.DashboardConfiguration]: Joi.object(),
				[ProfileSetting.DoNotShowFeeWarning]: Joi.boolean().required(),
				[ProfileSetting.FallbackToDefaultNodes]: Joi.boolean().default(true),
				[ProfileSetting.Locale]: Joi.string().required(),
				[ProfileSetting.Name]: Joi.string().required(),
				[ProfileSetting.Password]: Joi.string(),
				[ProfileSetting.Theme]: Joi.string().required(),
				[ProfileSetting.TimeFormat]: Joi.string().required(),
				[ProfileSetting.UseNetworkWalletNames]: Joi.boolean().default(false),
				[ProfileSetting.UseTestNetworks]: Joi.boolean().default(false),
				[ProfileSetting.UseHDWallets]: Joi.boolean().default(false),
				[ProfileSetting.Sessions]: Joi.object(),
				[ProfileSetting.LastVisitedPage]: Joi.object(),
				[ProfileSetting.WalletSelectionMode]: Joi.string().allow("single", "multiple").default("single"),
				[ProfileSetting.HideDustTokens]: Joi.boolean().optional().default(false),
			}).required(),
			wallets: Joi.object().pattern(
				Joi.string().uuid(),
				Joi.object({
					data: Joi.object().required(),
					id: Joi.string().required(),
					settings: Joi.object().required(),
				}),
			),
		}).validate(data, { allowUnknown: true, stripUnknown: true });

		if (error !== undefined) {
			throw error;
		}

		return value as IProfileData;
	}
}
