import type { NextFunction, Request, Response } from 'express';
import type { MiddlewareConfig, PaymentProofV1, X402Challenge } from './eventtypes.js';
import { serverConfig } from './config.js';
import { verifyPayment as verifyPaymentDefault } from './facilitator.js';
import { recordPayment } from './ledger.js';
import { networkFromRequest } from './network.js';

const MAX_DEPTH = 3;

type VerifyFn = (proof: PaymentProofV1, cfg: MiddlewareConfig, networkHint?: string) => Promise<boolean>;

function readDepth(req: Request): number {
  const raw = req.header('X-Aragorn-Max-Depth');
  const parsed = Number(raw ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function buildChallenge(req: Request, cfg: MiddlewareConfig): X402Challenge {
  const netConfig = networkFromRequest(req);
  const isWalletMode = (cfg.paymentMode ?? serverConfig.paymentMode) === 'wallet';

  return {
    x402Version: 1,
    recipient: cfg.snsDomain,
    amount: String(cfg.priceAtomic),
    asset: 'SOL',
    network: netConfig.solanaCluster === 'mainnet' ? 'solana-mainnet' : 'solana-devnet',
    expiresAt: Date.now() + 60_000,
    description: cfg.description,
    resource: `${serverConfig.serverBaseUrl}${cfg.resourcePath}`,
    paymentMode: cfg.paymentMode ?? serverConfig.paymentMode,
    recipientWallet: isWalletMode ? cfg.recipientWallet : undefined,
    mint: 'SOL',
    decimals: 9,
  };
}

export function x402Required(cfg: MiddlewareConfig, verifyFn: VerifyFn = verifyPaymentDefault) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const depth = readDepth(req);
    if (depth > MAX_DEPTH) {
      res.status(400).json({ error: 'MAX_DEPTH_EXCEEDED' });
      return;
    }

    const netConfig = networkFromRequest(req);
    const networkHint = netConfig.solanaCluster;

    const signature = req.header('X-Aragorn-Payment-Signature') ?? req.header('X-Payment-Signature');
    const ephemeralKey = req.header('X-Aragorn-Ephemeral-Key') ?? req.header('X-Aragorn-Payment-Ephemeral');
    if (!signature) {
      res.status(402).json(buildChallenge(req, cfg));
      return;
    }

    const proof: PaymentProofV1 = {
      umbraSignature: signature,
      umbraEphemeralKey: ephemeralKey ?? '',
      payer: req.header('X-Aragorn-Payer') ?? undefined,
      timestamp: Date.now(),
    };
    const valid = await verifyFn(proof, cfg, networkHint);
    if (!valid) {
      console.warn(`[x402] Payment verification failed for ${cfg.snsDomain}. Signature: ${signature.slice(0, 16)}...`);
      res.status(402).json({ error: 'PAYMENT_INVALID' });
      return;
    }

    const sessionId = (() => {
      const header = req.header('X-Aragorn-Session');
      if (header) return header;
      return typeof req.query.session === 'string' ? req.query.session : undefined;
    })();

    const requestId = req.header('X-Aragorn-Request-Id') ?? undefined;
    const jobId = req.header('X-Aragorn-Job-Id') ?? undefined;
    const parentJobId = req.header('X-Aragorn-Parent-Job-Id') ?? undefined;

    recordPayment({
      snsDomain: cfg.snsDomain,
      amountAtomic: cfg.priceAtomic,
      token: cfg.tokenKind,
      depth,
      payer: proof.payer,
      txSignature: proof.umbraSignature,
      ephemeralKey: proof.umbraEphemeralKey,
      paymentMode: cfg.paymentMode ?? serverConfig.paymentMode,
      sessionId,
      requestId,
      jobId,
      parentJobId,
      resource: cfg.resourcePath,
      headers: {
        'x-aragorn-payment-signature': signature,
        'x-aragorn-ephemeral-key': proof.umbraEphemeralKey,
        'x-aragorn-max-depth': String(depth),
        'x-aragorn-budget-remaining': req.header('X-Aragorn-Budget-Remaining') ?? '',
        'x-aragorn-request-id': requestId ?? '',
        'x-aragorn-job-id': jobId ?? '',
        'x-aragorn-parent-job-id': parentJobId ?? '',
        'x-aragorn-session': sessionId ?? '',
        'x-aragorn-network': networkHint,
      },
    });

    (req as any).aragorn = {
      paymentProof: proof,
      depth,
      budgetRemaining: req.header('X-Aragorn-Budget-Remaining') ?? null,
      sessionId,
      requestId,
      jobId,
      parentJobId,
      network: networkHint,
    };

    next();
  };
}
