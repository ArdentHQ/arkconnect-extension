import { Coins, Services } from '@ardenthq/sdk';
import { Contracts } from '@ardenthq/sdk-profiles';
import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from '@ardenthq/sdk-helpers';
import { useEnvironmentContext } from '@/lib/context/Environment';

export interface TransactionFees {
	static: string;
	max: string;
	min: string;
	avg: string;
	isDynamic?: boolean;
}

interface CreateStubTransactionProperties {
	coin: Coins.Coin;
	getData: (wallet: Contracts.IReadWriteWallet) => Record<string, any>;
	stub: boolean;
	type: string;
}

interface CalculateBySizeProperties {
	coin: Coins.Coin;
	data: Record<string, any>;
	type: string;
}

interface CalculateProperties {
	coin: string;
	data?: Record<string, any>;
	network: string;
	type: string;
}

export const useNetworkFees = ({profile, coin, network, type, data}: {
	profile: Contracts.IProfile;
	coin: string;
	network: string;
	type: string;
	data?: Record<string, any>;
}) => {
	const [isLoadingFee, setIsLoadingFee] = useState<boolean>(false);
	const [fees, setFees] = useState<TransactionFees>();
	const { env } = useEnvironmentContext();

	const getMuSigData = (senderWallet: Contracts.IReadWriteWallet, data: Record<string, any>) => {
		const participants = data?.participants ?? [];
		const minParticipants = data?.minParticipants ?? 2;

		const publicKey = senderWallet.publicKey();

		const publicKeys = participants.map((participant: any) => participant.publicKey);

		// Some coins like ARK, throw error if signatory's public key is not included in musig participants public keys.
		publicKeys.splice(1, 1, publicKey);

		return {
			// LSK
			mandatoryKeys: publicKeys,

			// ARK
			min: +minParticipants,

			numberOfSignatures: +minParticipants,
			optionalKeys: [],
			publicKeys,
			senderPublicKey: publicKey,
		};
	};

	const roundAndFormat = (value: BigNumber): string => {
		return parseFloat(value.toHuman().toFixed(4)).toString();
	};

	const getWallet = useCallback(
		async (coin: string, network: string) => profile.walletFactory().generate({ coin, network }),
		[profile],
	);

	const createStubTransaction = useCallback(
		async ({ coin, type, getData, stub }: CreateStubTransactionProperties) => {
			const { mnemonic, wallet } = await getWallet(coin.network().coin(), coin.network().id());

			const signatory = stub
				? await wallet.signatory().stub(mnemonic)
				: await wallet.signatory().mnemonic(mnemonic);

			return (coin.transaction() as any)[type]({
				data: getData(wallet),
				nonce: '1',
				signatory,
			});
		},
		[getWallet],
	);

	const calculateBySize = useCallback(
		async ({ coin, data, type }: CalculateBySizeProperties): Promise<TransactionFees> => {
			try {
				const transaction = await createStubTransaction({
					coin,
					getData: (senderWallet) => {
						if (type === 'multiSignature') {
							return getMuSigData(senderWallet, data);
						}

						return data;
					},
					stub: type === 'multiSignature',
					type,
				});

				const [min, avg, max] = await Promise.all([
					coin.fee().calculate(transaction, { priority: 'slow' }),
					coin.fee().calculate(transaction, { priority: 'average' }),
					coin.fee().calculate(transaction, { priority: 'fast' }),
				]);
				
				return {
					avg: roundAndFormat(avg),
					max: roundAndFormat(max),
					min: roundAndFormat(min),
					static: roundAndFormat(min),
				};
			} catch {
				return {
					avg: '0',
					max: '0',
					min: '0',
					static: '0',
				};
			}
		},
		[createStubTransaction],
	);

	const calculate = useCallback(
		async ({ coin, network, type, data }: CalculateProperties): Promise<TransactionFees> => {
			let transactionFees: Services.TransactionFee;

			const coinInstance = profile.coins().get(coin, network);

			try {
				transactionFees = env.fees().findByType(coin, network, type);
			} catch {
				await env.fees().syncAll(profile);

				transactionFees = env.fees().findByType(coin, network, type);
			}

			if (!!data && (coinInstance.network().feeType() === 'size' || type === 'multiSignature')) {
				const feesBySize = await calculateBySize({ coin: coinInstance, data, type });

				return {
					...feesBySize,
					isDynamic: transactionFees?.isDynamic,
				};
			}

			return {
				avg: roundAndFormat(transactionFees.avg),
				isDynamic: transactionFees.isDynamic,
				max: roundAndFormat(transactionFees.max),
				min: roundAndFormat(transactionFees.min),
				static: roundAndFormat(transactionFees.static),
			};
		},
		[profile, calculateBySize, env],
	);
	
	useEffect(() => {
		const fetchFees = async () => {
			setIsLoadingFee(true);

			const fees = await calculate({ coin, network, type, data });
			
			setFees(fees);
			setIsLoadingFee(false);
		};

		fetchFees();
	}, [calculate, coin, network, type, data]);

	return { isLoadingFee, fees };
};
