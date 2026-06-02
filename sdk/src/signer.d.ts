import type { PaymentProof, PaymentSignerOptions, X402Accept } from './types.js';
export declare class PaymentSigner {
    private readonly connection;
    private readonly payer;
    private readonly commitment;
    private readonly registryProgramId?;
    constructor(options: PaymentSignerOptions);
    signChallenge(challenge: X402Accept): Promise<PaymentProof>;
}
