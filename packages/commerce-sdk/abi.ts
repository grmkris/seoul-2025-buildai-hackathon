export const COMMERCE_ABI = [
	{
		type: "constructor",
		inputs: [
			{
				name: "_uniswap",
				type: "address",
				internalType: "contract IUniversalRouter",
			},
			{
				name: "_permit2",
				type: "address",
				internalType: "contract IPermit2",
			},
			{
				name: "_initialOperator",
				type: "address",
				internalType: "address",
			},
			{
				name: "_initialFeeDestination",
				type: "address",
				internalType: "address",
			},
			{
				name: "_wrappedNativeCurrency",
				type: "address",
				internalType: "contract IWrappedNativeCurrency",
			},
		],
		stateMutability: "nonpayable",
	},
	{
		type: "receive",
		stateMutability: "payable",
	},
	{
		type: "function",
		name: "getFeeDestination",
		inputs: [
			{
				name: "_operator",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "isIntentProcessed",
		inputs: [
			{
				name: "_operator",
				type: "address",
				internalType: "address",
			},
			{
				name: "_id",
				type: "bytes16",
				internalType: "bytes16",
			},
		],
		outputs: [
			{
				name: "",
				type: "bool",
				internalType: "bool",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "isOperatorRegistered",
		inputs: [
			{
				name: "_operator",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [
			{
				name: "",
				type: "bool",
				internalType: "bool",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "owner",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "pause",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "paused",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "bool",
				internalType: "bool",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "permit2",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "contract IPermit2",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "registerOperator",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "registerOperatorWithFeeDestination",
		inputs: [
			{
				name: "_feeDestination",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "renounceOwnership",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "setSweeper",
		inputs: [
			{
				name: "newSweeper",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "subsidizedTransferToken",
		inputs: [
			{
				name: "_intent",
				type: "tuple",
				internalType: "struct TransferIntent",
				components: [
					{
						name: "recipientAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "deadline",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "recipient",
						type: "address",
						internalType: "address payable",
					},
					{
						name: "recipientCurrency",
						type: "address",
						internalType: "address",
					},
					{
						name: "refundDestination",
						type: "address",
						internalType: "address",
					},
					{
						name: "feeAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "id",
						type: "bytes16",
						internalType: "bytes16",
					},
					{
						name: "operator",
						type: "address",
						internalType: "address",
					},
					{
						name: "signature",
						type: "bytes",
						internalType: "bytes",
					},
					{
						name: "prefix",
						type: "bytes",
						internalType: "bytes",
					},
				],
			},
			{
				name: "_signatureTransferData",
				type: "tuple",
				internalType: "struct EIP2612SignatureTransferData",
				components: [
					{
						name: "owner",
						type: "address",
						internalType: "address",
					},
					{
						name: "signature",
						type: "bytes",
						internalType: "bytes",
					},
				],
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "swapAndTransferUniswapV3Native",
		inputs: [
			{
				name: "_intent",
				type: "tuple",
				internalType: "struct TransferIntent",
				components: [
					{
						name: "recipientAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "deadline",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "recipient",
						type: "address",
						internalType: "address payable",
					},
					{
						name: "recipientCurrency",
						type: "address",
						internalType: "address",
					},
					{
						name: "refundDestination",
						type: "address",
						internalType: "address",
					},
					{
						name: "feeAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "id",
						type: "bytes16",
						internalType: "bytes16",
					},
					{
						name: "operator",
						type: "address",
						internalType: "address",
					},
					{
						name: "signature",
						type: "bytes",
						internalType: "bytes",
					},
					{
						name: "prefix",
						type: "bytes",
						internalType: "bytes",
					},
				],
			},
			{
				name: "poolFeesTier",
				type: "uint24",
				internalType: "uint24",
			},
		],
		outputs: [],
		stateMutability: "payable",
	},
	{
		type: "function",
		name: "swapAndTransferUniswapV3Token",
		inputs: [
			{
				name: "_intent",
				type: "tuple",
				internalType: "struct TransferIntent",
				components: [
					{
						name: "recipientAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "deadline",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "recipient",
						type: "address",
						internalType: "address payable",
					},
					{
						name: "recipientCurrency",
						type: "address",
						internalType: "address",
					},
					{
						name: "refundDestination",
						type: "address",
						internalType: "address",
					},
					{
						name: "feeAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "id",
						type: "bytes16",
						internalType: "bytes16",
					},
					{
						name: "operator",
						type: "address",
						internalType: "address",
					},
					{
						name: "signature",
						type: "bytes",
						internalType: "bytes",
					},
					{
						name: "prefix",
						type: "bytes",
						internalType: "bytes",
					},
				],
			},
			{
				name: "_signatureTransferData",
				type: "tuple",
				internalType: "struct Permit2SignatureTransferData",
				components: [
					{
						name: "permit",
						type: "tuple",
						internalType: "struct ISignatureTransfer.PermitTransferFrom",
						components: [
							{
								name: "permitted",
								type: "tuple",
								internalType: "struct ISignatureTransfer.TokenPermissions",
								components: [
									{
										name: "token",
										type: "address",
										internalType: "address",
									},
									{
										name: "amount",
										type: "uint256",
										internalType: "uint256",
									},
								],
							},
							{
								name: "nonce",
								type: "uint256",
								internalType: "uint256",
							},
							{
								name: "deadline",
								type: "uint256",
								internalType: "uint256",
							},
						],
					},
					{
						name: "transferDetails",
						type: "tuple",
						internalType: "struct ISignatureTransfer.SignatureTransferDetails",
						components: [
							{
								name: "to",
								type: "address",
								internalType: "address",
							},
							{
								name: "requestedAmount",
								type: "uint256",
								internalType: "uint256",
							},
						],
					},
					{
						name: "signature",
						type: "bytes",
						internalType: "bytes",
					},
				],
			},
			{
				name: "poolFeesTier",
				type: "uint24",
				internalType: "uint24",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "swapAndTransferUniswapV3TokenPreApproved",
		inputs: [
			{
				name: "_intent",
				type: "tuple",
				internalType: "struct TransferIntent",
				components: [
					{
						name: "recipientAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "deadline",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "recipient",
						type: "address",
						internalType: "address payable",
					},
					{
						name: "recipientCurrency",
						type: "address",
						internalType: "address",
					},
					{
						name: "refundDestination",
						type: "address",
						internalType: "address",
					},
					{
						name: "feeAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "id",
						type: "bytes16",
						internalType: "bytes16",
					},
					{
						name: "operator",
						type: "address",
						internalType: "address",
					},
					{
						name: "signature",
						type: "bytes",
						internalType: "bytes",
					},
					{
						name: "prefix",
						type: "bytes",
						internalType: "bytes",
					},
				],
			},
			{
				name: "_tokenIn",
				type: "address",
				internalType: "address",
			},
			{
				name: "maxWillingToPay",
				type: "uint256",
				internalType: "uint256",
			},
			{
				name: "poolFeesTier",
				type: "uint24",
				internalType: "uint24",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "sweepETH",
		inputs: [
			{
				name: "destination",
				type: "address",
				internalType: "address payable",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "sweepETHAmount",
		inputs: [
			{
				name: "destination",
				type: "address",
				internalType: "address payable",
			},
			{
				name: "amount",
				type: "uint256",
				internalType: "uint256",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "sweepToken",
		inputs: [
			{
				name: "_token",
				type: "address",
				internalType: "address",
			},
			{
				name: "destination",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "sweepTokenAmount",
		inputs: [
			{
				name: "_token",
				type: "address",
				internalType: "address",
			},
			{
				name: "destination",
				type: "address",
				internalType: "address",
			},
			{
				name: "amount",
				type: "uint256",
				internalType: "uint256",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "sweeper",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "transferNative",
		inputs: [
			{
				name: "_intent",
				type: "tuple",
				internalType: "struct TransferIntent",
				components: [
					{
						name: "recipientAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "deadline",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "recipient",
						type: "address",
						internalType: "address payable",
					},
					{
						name: "recipientCurrency",
						type: "address",
						internalType: "address",
					},
					{
						name: "refundDestination",
						type: "address",
						internalType: "address",
					},
					{
						name: "feeAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "id",
						type: "bytes16",
						internalType: "bytes16",
					},
					{
						name: "operator",
						type: "address",
						internalType: "address",
					},
					{
						name: "signature",
						type: "bytes",
						internalType: "bytes",
					},
					{
						name: "prefix",
						type: "bytes",
						internalType: "bytes",
					},
				],
			},
		],
		outputs: [],
		stateMutability: "payable",
	},
	{
		type: "function",
		name: "transferOwnership",
		inputs: [
			{
				name: "newOwner",
				type: "address",
				internalType: "address",
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "transferToken",
		inputs: [
			{
				name: "_intent",
				type: "tuple",
				internalType: "struct TransferIntent",
				components: [
					{
						name: "recipientAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "deadline",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "recipient",
						type: "address",
						internalType: "address payable",
					},
					{
						name: "recipientCurrency",
						type: "address",
						internalType: "address",
					},
					{
						name: "refundDestination",
						type: "address",
						internalType: "address",
					},
					{
						name: "feeAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "id",
						type: "bytes16",
						internalType: "bytes16",
					},
					{
						name: "operator",
						type: "address",
						internalType: "address",
					},
					{
						name: "signature",
						type: "bytes",
						internalType: "bytes",
					},
					{
						name: "prefix",
						type: "bytes",
						internalType: "bytes",
					},
				],
			},
			{
				name: "_signatureTransferData",
				type: "tuple",
				internalType: "struct Permit2SignatureTransferData",
				components: [
					{
						name: "permit",
						type: "tuple",
						internalType: "struct ISignatureTransfer.PermitTransferFrom",
						components: [
							{
								name: "permitted",
								type: "tuple",
								internalType: "struct ISignatureTransfer.TokenPermissions",
								components: [
									{
										name: "token",
										type: "address",
										internalType: "address",
									},
									{
										name: "amount",
										type: "uint256",
										internalType: "uint256",
									},
								],
							},
							{
								name: "nonce",
								type: "uint256",
								internalType: "uint256",
							},
							{
								name: "deadline",
								type: "uint256",
								internalType: "uint256",
							},
						],
					},
					{
						name: "transferDetails",
						type: "tuple",
						internalType: "struct ISignatureTransfer.SignatureTransferDetails",
						components: [
							{
								name: "to",
								type: "address",
								internalType: "address",
							},
							{
								name: "requestedAmount",
								type: "uint256",
								internalType: "uint256",
							},
						],
					},
					{
						name: "signature",
						type: "bytes",
						internalType: "bytes",
					},
				],
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "transferTokenPreApproved",
		inputs: [
			{
				name: "_intent",
				type: "tuple",
				internalType: "struct TransferIntent",
				components: [
					{
						name: "recipientAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "deadline",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "recipient",
						type: "address",
						internalType: "address payable",
					},
					{
						name: "recipientCurrency",
						type: "address",
						internalType: "address",
					},
					{
						name: "refundDestination",
						type: "address",
						internalType: "address",
					},
					{
						name: "feeAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "id",
						type: "bytes16",
						internalType: "bytes16",
					},
					{
						name: "operator",
						type: "address",
						internalType: "address",
					},
					{
						name: "signature",
						type: "bytes",
						internalType: "bytes",
					},
					{
						name: "prefix",
						type: "bytes",
						internalType: "bytes",
					},
				],
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "uniswap",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "contract IUniversalRouter",
			},
		],
		stateMutability: "view",
	},
	{
		type: "function",
		name: "unpause",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "unregisterOperator",
		inputs: [],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "unwrapAndTransfer",
		inputs: [
			{
				name: "_intent",
				type: "tuple",
				internalType: "struct TransferIntent",
				components: [
					{
						name: "recipientAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "deadline",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "recipient",
						type: "address",
						internalType: "address payable",
					},
					{
						name: "recipientCurrency",
						type: "address",
						internalType: "address",
					},
					{
						name: "refundDestination",
						type: "address",
						internalType: "address",
					},
					{
						name: "feeAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "id",
						type: "bytes16",
						internalType: "bytes16",
					},
					{
						name: "operator",
						type: "address",
						internalType: "address",
					},
					{
						name: "signature",
						type: "bytes",
						internalType: "bytes",
					},
					{
						name: "prefix",
						type: "bytes",
						internalType: "bytes",
					},
				],
			},
			{
				name: "_signatureTransferData",
				type: "tuple",
				internalType: "struct Permit2SignatureTransferData",
				components: [
					{
						name: "permit",
						type: "tuple",
						internalType: "struct ISignatureTransfer.PermitTransferFrom",
						components: [
							{
								name: "permitted",
								type: "tuple",
								internalType: "struct ISignatureTransfer.TokenPermissions",
								components: [
									{
										name: "token",
										type: "address",
										internalType: "address",
									},
									{
										name: "amount",
										type: "uint256",
										internalType: "uint256",
									},
								],
							},
							{
								name: "nonce",
								type: "uint256",
								internalType: "uint256",
							},
							{
								name: "deadline",
								type: "uint256",
								internalType: "uint256",
							},
						],
					},
					{
						name: "transferDetails",
						type: "tuple",
						internalType: "struct ISignatureTransfer.SignatureTransferDetails",
						components: [
							{
								name: "to",
								type: "address",
								internalType: "address",
							},
							{
								name: "requestedAmount",
								type: "uint256",
								internalType: "uint256",
							},
						],
					},
					{
						name: "signature",
						type: "bytes",
						internalType: "bytes",
					},
				],
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "unwrapAndTransferPreApproved",
		inputs: [
			{
				name: "_intent",
				type: "tuple",
				internalType: "struct TransferIntent",
				components: [
					{
						name: "recipientAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "deadline",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "recipient",
						type: "address",
						internalType: "address payable",
					},
					{
						name: "recipientCurrency",
						type: "address",
						internalType: "address",
					},
					{
						name: "refundDestination",
						type: "address",
						internalType: "address",
					},
					{
						name: "feeAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "id",
						type: "bytes16",
						internalType: "bytes16",
					},
					{
						name: "operator",
						type: "address",
						internalType: "address",
					},
					{
						name: "signature",
						type: "bytes",
						internalType: "bytes",
					},
					{
						name: "prefix",
						type: "bytes",
						internalType: "bytes",
					},
				],
			},
		],
		outputs: [],
		stateMutability: "nonpayable",
	},
	{
		type: "function",
		name: "wrapAndTransfer",
		inputs: [
			{
				name: "_intent",
				type: "tuple",
				internalType: "struct TransferIntent",
				components: [
					{
						name: "recipientAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "deadline",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "recipient",
						type: "address",
						internalType: "address payable",
					},
					{
						name: "recipientCurrency",
						type: "address",
						internalType: "address",
					},
					{
						name: "refundDestination",
						type: "address",
						internalType: "address",
					},
					{
						name: "feeAmount",
						type: "uint256",
						internalType: "uint256",
					},
					{
						name: "id",
						type: "bytes16",
						internalType: "bytes16",
					},
					{
						name: "operator",
						type: "address",
						internalType: "address",
					},
					{
						name: "signature",
						type: "bytes",
						internalType: "bytes",
					},
					{
						name: "prefix",
						type: "bytes",
						internalType: "bytes",
					},
				],
			},
		],
		outputs: [],
		stateMutability: "payable",
	},
	{
		type: "function",
		name: "wrappedNativeCurrency",
		inputs: [],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "contract IWrappedNativeCurrency",
			},
		],
		stateMutability: "view",
	},
	{
		type: "event",
		name: "OperatorRegistered",
		inputs: [
			{
				name: "operator",
				type: "address",
				indexed: false,
				internalType: "address",
			},
			{
				name: "feeDestination",
				type: "address",
				indexed: false,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "OperatorUnregistered",
		inputs: [
			{
				name: "operator",
				type: "address",
				indexed: false,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "OwnershipTransferred",
		inputs: [
			{
				name: "previousOwner",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "newOwner",
				type: "address",
				indexed: true,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "Paused",
		inputs: [
			{
				name: "account",
				type: "address",
				indexed: false,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "Transferred",
		inputs: [
			{
				name: "operator",
				type: "address",
				indexed: true,
				internalType: "address",
			},
			{
				name: "id",
				type: "bytes16",
				indexed: false,
				internalType: "bytes16",
			},
			{
				name: "recipient",
				type: "address",
				indexed: false,
				internalType: "address",
			},
			{
				name: "sender",
				type: "address",
				indexed: false,
				internalType: "address",
			},
			{
				name: "spentAmount",
				type: "uint256",
				indexed: false,
				internalType: "uint256",
			},
			{
				name: "spentCurrency",
				type: "address",
				indexed: false,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "event",
		name: "Unpaused",
		inputs: [
			{
				name: "account",
				type: "address",
				indexed: false,
				internalType: "address",
			},
		],
		anonymous: false,
	},
	{
		type: "error",
		name: "AlreadyProcessed",
		inputs: [],
	},
	{
		type: "error",
		name: "ExpiredIntent",
		inputs: [],
	},
	{
		type: "error",
		name: "IncorrectCurrency",
		inputs: [
			{
				name: "attemptedCurrency",
				type: "address",
				internalType: "address",
			},
		],
	},
	{
		type: "error",
		name: "InexactTransfer",
		inputs: [],
	},
	{
		type: "error",
		name: "InsufficientAllowance",
		inputs: [
			{
				name: "difference",
				type: "uint256",
				internalType: "uint256",
			},
		],
	},
	{
		type: "error",
		name: "InsufficientBalance",
		inputs: [
			{
				name: "difference",
				type: "uint256",
				internalType: "uint256",
			},
		],
	},
	{
		type: "error",
		name: "InvalidNativeAmount",
		inputs: [
			{
				name: "difference",
				type: "int256",
				internalType: "int256",
			},
		],
	},
	{
		type: "error",
		name: "InvalidSignature",
		inputs: [],
	},
	{
		type: "error",
		name: "InvalidTransferDetails",
		inputs: [],
	},
	{
		type: "error",
		name: "NativeTransferFailed",
		inputs: [
			{
				name: "recipient",
				type: "address",
				internalType: "address",
			},
			{
				name: "amount",
				type: "uint256",
				internalType: "uint256",
			},
			{
				name: "isRefund",
				type: "bool",
				internalType: "bool",
			},
			{
				name: "data",
				type: "bytes",
				internalType: "bytes",
			},
		],
	},
	{
		type: "error",
		name: "NullRecipient",
		inputs: [],
	},
	{
		type: "error",
		name: "OperatorNotRegistered",
		inputs: [],
	},
	{
		type: "error",
		name: "SwapFailedBytes",
		inputs: [
			{
				name: "reason",
				type: "bytes",
				internalType: "bytes",
			},
		],
	},
	{
		type: "error",
		name: "SwapFailedString",
		inputs: [
			{
				name: "reason",
				type: "string",
				internalType: "string",
			},
		],
	},
] as const;
