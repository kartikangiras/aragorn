import { SystemProgram, Transaction } from '@solana/web3.js';
export function buildSolTransferTx(params) {
    return new Transaction().add(SystemProgram.transfer({
        fromPubkey: params.from,
        toPubkey: params.to,
        lamports: params.lamports,
    }));
}
