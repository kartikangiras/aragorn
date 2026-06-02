import { SystemProgram, Transaction } from '@solana/web3.js';

export interface SolTransferParams {
  from: import('@solana/web3.js').PublicKey;
  to: import('@solana/web3.js').PublicKey;
  lamports: number;
}

export function buildSolTransferTx(params: SolTransferParams): Transaction {
  return new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: params.from,
      toPubkey: params.to,
      lamports: params.lamports,
    }),
  );
}
