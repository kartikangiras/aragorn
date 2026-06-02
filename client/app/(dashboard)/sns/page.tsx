'use client';

import SNSIntegration from '@/components/SNSIntegration';

export default function SNSPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">SNS Resolution</h1>
        <p className="text-sm text-aragorn-text-secondary">Bonfida SPL Name Service domain resolution for agent routing</p>
      </div>

      <SNSIntegration />

      <div className="p-5 border border-aragorn-border bg-aragorn-graphite/60 rounded-lg">
        <h3 className="text-sm font-semibold mb-3">Registered Agent Domains</h3>
        <div className="space-y-2">
          {[
            { domain: 'weather.aragorn.sol', agent: 'WeatherBot' },
            { domain: 'summarizer.aragorn.sol', agent: 'Summarizer' },
            { domain: 'math.aragorn.sol', agent: 'MathSolver' },
            { domain: 'sentiment.aragorn.sol', agent: 'SentimentAI' },
            { domain: 'code-explainer.aragorn.sol', agent: 'CodeExplainer' },
            { domain: 'translate.aragorn.sol', agent: 'TranslateBot' },
            { domain: 'research.aragorn.sol', agent: 'DeepResearch' },
            { domain: 'coding.aragorn.sol', agent: 'CodingAgent' },
            { domain: 'sovereign.aragorn.sol', agent: 'SovereignSpecialist' },
            { domain: 'data.aragorn.sol', agent: 'DataAnalyst' },
            { domain: 'audit.aragorn.sol', agent: 'ContractAuditor' },
            { domain: 'defi.aragorn.sol', agent: 'DeFiStrategist' },
            { domain: 'image.aragorn.sol', agent: 'ImageGenerator' },
            { domain: 'oracle.aragorn.sol', agent: 'MarketOracle' },
            { domain: 'legal.aragorn.sol', agent: 'LegalAdvisor' },
            { domain: 'social.aragorn.sol', agent: 'SocialMediaBot' },
            { domain: 'trading.aragorn.sol', agent: 'TradingBot' },
            { domain: 'medical.aragorn.sol', agent: 'MedicalAdvisor' },
          ].map((item) => (
            <div
              key={item.domain}
              className="flex items-center justify-between p-2 rounded-md bg-aragorn-black border border-aragorn-border"
            >
              <span className="text-xs font-mono text-blue-400">{item.domain}</span>
              <span className="text-[10px] text-aragorn-text-muted">{item.agent}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 py-4 text-[10px] text-aragorn-text-muted border-t border-aragorn-border">
        <span>Powered by</span>
        <img src="/sns.png" alt="SNS" className="w-4 h-4 rounded-sm object-contain" />
        <span className="text-blue-400 font-medium">Bonfida SPL Name Service</span>
      </div>
    </div>
  );
}
