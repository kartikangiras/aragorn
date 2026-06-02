'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Cpu, ShieldCheck, CreditCard, BarChart3, Loader2 } from 'lucide-react';
import SNSIntegration from '@/components/SNSIntegration';
import QVACIntegration from '@/components/QVACIntegration';
import IntegrationsStatus from '@/components/IntegrationsStatus';

const integrations = [
  { name: 'SNS Resolution', icon: Globe, status: 'connected', description: 'Bonfida .sol domain resolution', color: 'text-blue-400' },
  { name: 'QVAC Embeddings', icon: Cpu, status: 'connected', description: 'Local on-device vector similarity', color: 'text-aragorn-purple-bright' },
  { name: 'Umbra Privacy', icon: ShieldCheck, status: 'connected', description: 'Stealth address transfers', color: 'text-aragorn-emerald' },
  { name: 'Dodo Payments', icon: CreditCard, status: 'connected', description: 'Fiat on-ramp integration', color: 'text-aragorn-amber' },
  { name: 'Covalent Analytics', icon: BarChart3, status: 'connected', description: 'Blockchain data indexing', color: 'text-aragorn-cyan' },
];

export default function IntegrationsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">SNS + QVAC Integrations</h1>
        <p className="text-sm text-aragorn-text-secondary">Connected services and API health</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={24} className="animate-spin text-aragorn-emerald" />
        </div>
      ) : (
        <>
          {/* Detailed SNS + QVAC */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SNSIntegration />
            <QVACIntegration />
          </div>

          {/* All integrations overview */}
          <Card className="border-aragorn-border bg-aragorn-graphite/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">All Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.map((integration) => (
                  <div
                    key={integration.name}
                    className="p-4 rounded-lg bg-aragorn-black border border-aragorn-border hover:border-aragorn-emerald/20 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 rounded-lg bg-aragorn-surface flex items-center justify-center ${integration.color}`}>
                        <integration.icon size={18} />
                      </div>
                      <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'} className="text-[10px]">
                        {integration.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-xs mb-1">{integration.name}</h3>
                    <p className="text-[10px] text-aragorn-text-secondary">{integration.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live status panel */}
          <IntegrationsStatus />
        </>
      )}
    </div>
  );
}
