import { PublicKey, Transaction } from '@solana/web3.js';
export interface SolTransferParams {
    from: PublicKey;
    to: PublicKey;
    lamports: number;
}
export declare function buildSolTransferTx(params: SolTransferParams): Transaction;
