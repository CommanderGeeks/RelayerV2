"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = void 0;
exports.IDL = {
    "address": "qLbS4ESAAgJPUVFn6Jiu7HGEPEPT7ZrxPLu9DLJsGoE",
    "metadata": {
        "name": "portal",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "add_chain",
            "discriminator": [
                79,
                22,
                106,
                60,
                233,
                126,
                27,
                97
            ],
            "accounts": [
                {
                    "name": "config",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    99,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "admin",
                    "signer": true,
                    "relations": [
                        "config"
                    ]
                }
            ],
            "args": [
                {
                    "name": "chain_id",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "add_token",
            "discriminator": [
                237,
                255,
                26,
                54,
                56,
                48,
                68,
                52
            ],
            "accounts": [
                {
                    "name": "config",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    99,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "admin",
                    "signer": true,
                    "relations": [
                        "config"
                    ]
                }
            ],
            "args": [
                {
                    "name": "mint",
                    "type": "pubkey"
                },
                {
                    "name": "min_tx",
                    "type": "u64"
                },
                {
                    "name": "max_tx",
                    "type": "u64"
                },
                {
                    "name": "is_origin_chain",
                    "type": "bool"
                }
            ]
        },
        {
            "name": "change_is_origin_chain",
            "discriminator": [
                205,
                51,
                2,
                183,
                68,
                118,
                211,
                156
            ],
            "accounts": [
                {
                    "name": "config",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    99,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "admin",
                    "signer": true,
                    "relations": [
                        "config"
                    ]
                }
            ],
            "args": [
                {
                    "name": "token_address",
                    "type": "pubkey"
                },
                {
                    "name": "is_origin_chain",
                    "type": "bool"
                }
            ]
        },
        {
            "name": "change_tx_lower_limit",
            "discriminator": [
                191,
                60,
                172,
                92,
                35,
                13,
                193,
                34
            ],
            "accounts": [
                {
                    "name": "config",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    99,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "admin",
                    "signer": true,
                    "relations": [
                        "config"
                    ]
                }
            ],
            "args": [
                {
                    "name": "token_address",
                    "type": "pubkey"
                },
                {
                    "name": "min_tx",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "change_tx_upper_limit",
            "discriminator": [
                18,
                133,
                19,
                119,
                27,
                15,
                44,
                225
            ],
            "accounts": [
                {
                    "name": "config",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    99,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "admin",
                    "signer": true,
                    "relations": [
                        "config"
                    ]
                }
            ],
            "args": [
                {
                    "name": "token_address",
                    "type": "pubkey"
                },
                {
                    "name": "max_tx",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "deposit",
            "discriminator": [
                242,
                35,
                198,
                137,
                82,
                225,
                242,
                182
            ],
            "accounts": [
                {
                    "name": "config",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    99,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "depositor",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "depositor_token_account",
                    "writable": true
                },
                {
                    "name": "vault_authority",
                    "docs": [
                        "The vault authority PDA that controls the vault token account.",
                        "Note: This is a PDA derived from a known seed."
                    ],
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    118,
                                    97,
                                    117,
                                    108,
                                    116,
                                    95,
                                    97,
                                    117,
                                    116,
                                    104,
                                    111,
                                    114,
                                    105,
                                    116,
                                    121
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "vault_token_account",
                    "docs": [
                        "The vault token account that will hold the deposited tokens.",
                        "Its authority must be set to the vault authority PDA."
                    ],
                    "writable": true
                },
                {
                    "name": "fee_to_token_account",
                    "writable": true
                },
                {
                    "name": "mint"
                },
                {
                    "name": "token_program",
                    "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                },
                {
                    "name": "system_program",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                },
                {
                    "name": "dest_chain_id",
                    "type": "u64"
                },
                {
                    "name": "receiver",
                    "type": "string"
                }
            ]
        },
        {
            "name": "initialize",
            "discriminator": [
                175,
                175,
                109,
                31,
                13,
                152,
                155,
                237
            ],
            "accounts": [
                {
                    "name": "config",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    99,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "admin",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "system_program",
                    "address": "11111111111111111111111111111111"
                },
                {
                    "name": "vault_authority",
                    "docs": [
                        "Initialize vault authority account",
                        "The vault authority PDA that controls the vault token account.",
                        "Note: This is a PDA derived from a known seed."
                    ],
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    118,
                                    97,
                                    117,
                                    108,
                                    116,
                                    95,
                                    97,
                                    117,
                                    116,
                                    104,
                                    111,
                                    114,
                                    105,
                                    116,
                                    121
                                ]
                            }
                        ]
                    }
                }
            ],
            "args": [
                {
                    "name": "fee_to",
                    "type": "pubkey"
                },
                {
                    "name": "default_fee",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "remove_token",
            "discriminator": [
                149,
                134,
                57,
                61,
                136,
                2,
                144,
                145
            ],
            "accounts": [
                {
                    "name": "config",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    99,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "admin",
                    "signer": true,
                    "relations": [
                        "config"
                    ]
                }
            ],
            "args": [
                {
                    "name": "token_address",
                    "type": "pubkey"
                }
            ]
        },
        {
            "name": "toggle_halt",
            "discriminator": [
                160,
                101,
                114,
                220,
                105,
                40,
                106,
                182
            ],
            "accounts": [
                {
                    "name": "config",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    99,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "admin",
                    "signer": true,
                    "relations": [
                        "config"
                    ]
                }
            ],
            "args": []
        },
        {
            "name": "withdraw",
            "discriminator": [
                183,
                18,
                70,
                156,
                148,
                109,
                161,
                34
            ],
            "accounts": [
                {
                    "name": "config",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    99,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "admin",
                    "signer": true,
                    "relations": [
                        "config"
                    ]
                },
                {
                    "name": "vault_authority",
                    "docs": [
                        "The same vault authority PDA as in the deposit instruction.",
                        "It signs the withdrawal via CPI."
                    ],
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    118,
                                    97,
                                    117,
                                    108,
                                    116,
                                    95,
                                    97,
                                    117,
                                    116,
                                    104,
                                    111,
                                    114,
                                    105,
                                    116,
                                    121
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "vault_token_account",
                    "docs": [
                        "The vault token account from which tokens will be withdrawn.",
                        "Its authority is the vault authority PDA."
                    ],
                    "writable": true
                },
                {
                    "name": "receiver_token_account",
                    "writable": true
                },
                {
                    "name": "mint_account",
                    "writable": true
                },
                {
                    "name": "token_program",
                    "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                },
                {
                    "name": "system_program",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "receiver",
                    "type": "pubkey"
                },
                {
                    "name": "amount",
                    "type": "u64"
                },
                {
                    "name": "token_address",
                    "type": "pubkey"
                },
                {
                    "name": "from_chain_id",
                    "type": "u64"
                },
                {
                    "name": "tx_hash",
                    "type": "string"
                }
            ]
        },
        {
            "name": "withdraw_tokens",
            "discriminator": [
                2,
                4,
                225,
                61,
                19,
                182,
                106,
                170
            ],
            "accounts": [
                {
                    "name": "config",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    99,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "admin",
                    "signer": true,
                    "relations": [
                        "config"
                    ]
                },
                {
                    "name": "vault_authority",
                    "docs": [
                        "The same vault authority PDA as in the deposit instruction.",
                        "It signs the withdrawal via CPI."
                    ],
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    118,
                                    97,
                                    117,
                                    108,
                                    116,
                                    95,
                                    97,
                                    117,
                                    116,
                                    104,
                                    111,
                                    114,
                                    105,
                                    116,
                                    121
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "vault_token_account",
                    "docs": [
                        "The vault token account from which tokens will be withdrawn.",
                        "Its authority is the vault authority PDA."
                    ],
                    "writable": true
                },
                {
                    "name": "receiver_token_account",
                    "writable": true
                },
                {
                    "name": "mint_account",
                    "writable": true
                },
                {
                    "name": "token_program",
                    "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                },
                {
                    "name": "system_program",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "receiver",
                    "type": "pubkey"
                },
                {
                    "name": "amount",
                    "type": "u64"
                },
                {
                    "name": "token_address",
                    "type": "pubkey"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "Config",
            "discriminator": [
                155,
                12,
                170,
                224,
                30,
                250,
                204,
                130
            ]
        },
        {
            "name": "VaultAuthorityAccount",
            "discriminator": [
                67,
                189,
                235,
                231,
                225,
                62,
                148,
                137
            ]
        }
    ],
    "events": [
        {
            "name": "DepositEvent",
            "discriminator": [
                120,
                248,
                61,
                83,
                31,
                142,
                107,
                144
            ]
        },
        {
            "name": "WithdrawEvent",
            "discriminator": [
                22,
                9,
                133,
                26,
                160,
                44,
                71,
                192
            ]
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "BridgeHalted",
            "msg": "Bridge is currently halted."
        },
        {
            "code": 6001,
            "name": "InvalidTransactionAmount",
            "msg": "Invalid transaction amount."
        },
        {
            "code": 6002,
            "name": "TokenNotActive",
            "msg": "Token is not active."
        },
        {
            "code": 6003,
            "name": "TokenNotFound",
            "msg": "Token not found."
        },
        {
            "code": 6004,
            "name": "InvalidAmount",
            "msg": "Invalid amount."
        },
        {
            "code": 6005,
            "name": "ChainAlreadyExists",
            "msg": "The chain ID already exists."
        },
        {
            "code": 6006,
            "name": "TokenAlreadyExists",
            "msg": "The token already exists."
        },
        {
            "code": 6007,
            "name": "DuplicateTransaction",
            "msg": "Duplicate transaction."
        },
        {
            "code": 6008,
            "name": "BridgeOnHold",
            "msg": "Bridge is on temporary hold."
        },
        {
            "code": 6009,
            "name": "InvalidReceiver",
            "msg": "Invalid receiver address."
        },
        {
            "code": 6010,
            "name": "AmountExceedsMaxTransfer",
            "msg": "Amount exceeds max transfer limit."
        }
    ],
    "types": [
        {
            "name": "Config",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "admin",
                        "type": "pubkey"
                    },
                    {
                        "name": "fee_to",
                        "type": "pubkey"
                    },
                    {
                        "name": "default_fee",
                        "type": "u64"
                    },
                    {
                        "name": "halt",
                        "type": "bool"
                    },
                    {
                        "name": "supported_chains",
                        "type": {
                            "vec": "u64"
                        }
                    },
                    {
                        "name": "tx_hashes",
                        "type": {
                            "vec": "string"
                        }
                    },
                    {
                        "name": "tokens",
                        "type": {
                            "vec": {
                                "defined": {
                                    "name": "TokenData"
                                }
                            }
                        }
                    }
                ]
            }
        },
        {
            "name": "DepositEvent",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "sender",
                        "type": "pubkey"
                    },
                    {
                        "name": "receiver",
                        "type": "string"
                    },
                    {
                        "name": "token",
                        "type": "pubkey"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    },
                    {
                        "name": "fee",
                        "type": "u64"
                    },
                    {
                        "name": "dest_chain_id",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "TokenData",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "mint",
                        "type": "pubkey"
                    },
                    {
                        "name": "min_tx",
                        "type": "u64"
                    },
                    {
                        "name": "max_tx",
                        "type": "u64"
                    },
                    {
                        "name": "active",
                        "type": "bool"
                    },
                    {
                        "name": "fee",
                        "type": "u64"
                    },
                    {
                        "name": "is_origin_chain",
                        "type": "bool"
                    }
                ]
            }
        },
        {
            "name": "VaultAuthorityAccount",
            "type": {
                "kind": "struct",
                "fields": []
            }
        },
        {
            "name": "WithdrawEvent",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "receiver",
                        "type": "pubkey"
                    },
                    {
                        "name": "token_address",
                        "type": "pubkey"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    },
                    {
                        "name": "from_chain_id",
                        "type": "u64"
                    },
                    {
                        "name": "tx_hash",
                        "type": "string"
                    }
                ]
            }
        }
    ]
};
