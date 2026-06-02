import { PublicKey, Transaction, SystemProgram, Connection } from '@solana/web3.js';
import type { X402Accept, PaymentProof } from '@/lib/types';

export interface WalletSignerOptions {
  publicKey: PublicKey;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  sendTransaction: (tx: Transaction, connection: Connection) => Promise<string>;
  connection: Connection;
}

export async function signChallengeWithWallet(
  challenge: X402Accept,
  opts: WalletSignerOptions,
): Promise<PaymentProof> {
  const { publicKey, signTransaction, sendTransaction, connection } = opts;
  const amount = BigInt(challenge.maxAmountRequired);

  // Validate recipient address
  let recipient: PublicKey;
  try {
    recipient = new PublicKey(challenge.payTo);
  } catch {
    throw new Error(
      `Invalid recipient address: "${challenge.payTo}". ` +
      `Expected a valid Solana base58 public key. ` +
      `This usually means the agent's wallet address is not configured on the backend.`
    );
  }

  const tx = new Transaction();

  tx.add(
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipient,
      lamports: Number(amount),
    }),
  );

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;
  tx.feePayer = publicKey;

  // Pre-simulate to catch errors before opening Phantom
  try {
    const simulation = await connection.simulateTransaction(tx);
    if (simulation.value.err) {
      const logs = simulation.value.logs?.slice(-3).join('\n') ?? 'Unknown simulation error';
      throw new Error(`Transaction simulation failed: ${logs}`);
    }
  } catch (simError: any) {
    if (simError?.message?.includes('Insufficient')) throw simError;
    // Ignore simulation errors that are just RPC issues
  }

  const signed = await signTransaction(tx);
  const signature = await sendTransaction(signed, connection);

  // Wait for confirmation
  await connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    'confirmed',
  );

  return {
    signature,
    ephemeralKey: publicKey.toBase58(),
    payer: publicKey.toBase58(),
    amount: challenge.maxAmountRequired,
    asset: challenge.asset,
    resource: challenge.resource,
  };
}
