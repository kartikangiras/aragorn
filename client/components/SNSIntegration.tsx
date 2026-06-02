'use client';

import { useState, useEffect } from 'react';
import { Globe, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

interface SnsStatus {
  ok: boolean;
  detail: string;
  resolvedDomain?: string;
  owner?: string;
}

export default function SNSIntegration() {
  const [status, setStatus] = useState<SnsStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/integrations/diagnostics')
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        const probe = data.probes?.find((p: any) => p.name === 'sns');
        if (probe) {
          // Try to parse owner from detail string like "toly.sol owner=xxx"
          const match = probe.detail?.match(/owner=([A-Za-z0-9]+)/);
          setStatus({
            ok: probe.ok,
            detail: probe.detail,
            resolvedDomain: probe.ok ? (probe.detail?.match(/^[^\s]+/)?.[0] ?? 'toly.sol') : undefined,
            owner: match ? match[1] : undefined,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setStatus({ ok: false, detail: 'Failed to reach diagnostics endpoint' });
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <div className="p-5 border border-aragorn-border bg-aragorn-graphite/60 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Globe size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold">SNS Resolution</h3>
            <p className="text-[10px] text-aragorn-text-muted">Bonfida .sol domain → Solana pubkey</p>
          </div>
        </div>
        {loading ? (
          <Loader2 size={14} className="animate-spin text-aragorn-text-muted" />
        ) : status?.ok ? (
          <CheckCircle2 size={16} className="text-aragorn-emerald" />
        ) : (
          <AlertCircle size={16} className="text-aragorn-rose" />
        )}
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-md bg-aragorn-black border border-aragorn-border">
          <p className="text-[10px] text-aragorn-text-muted uppercase tracking-wider mb-1">How it works</p>
          <p className="text-xs text-aragorn-text-secondary leading-relaxed">
            Every agent registers an SNS domain (e.g., <code className="text-aragorn-emerald">weather.aragorn.sol</code>).
            When the orchestrator hires an agent, it resolves the domain via the Bonfida SPL Name Service
            to get the recipient&apos;s Solana public key for payment routing.
          </p>
        </div>

        {status && (
          <div className="p-3 rounded-md bg-aragorn-black border border-aragorn-border">
            <p className="text-[10px] text-aragorn-text-muted uppercase tracking-wider mb-2">Live Probe</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-aragorn-text-secondary">Status</span>
                <span className={status.ok ? 'text-aragorn-emerald' : 'text-aragorn-rose'}>
                  {status.ok ? 'Connected' : 'Error'}
                </span>
              </div>
              {status.resolvedDomain && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-aragorn-text-secondary">Test Domain</span>
                  <span className="text-aragorn-cyan font-mono">{status.resolvedDomain}</span>
                </div>
              )}
              {status.owner && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-aragorn-text-secondary">Resolved Owner</span>
                  <span className="text-aragorn-emerald font-mono truncate max-w-[140px]" title={status.owner}>
                    {status.owner.slice(0, 12)}...
                  </span>
                </div>
              )}
              <div className="text-[10px] text-aragorn-text-muted mt-1 truncate" title={status.detail}>
                {status.detail}
              </div>
            </div>
          </div>
        )}
      </div>

      <a
        href="https://github.com/Bonfida/sns-sdk"
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
      >
        <ExternalLink size={9} />
        Bonfida SNS SDK
      </a>
    </div>
  );
}
