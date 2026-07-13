import { useState } from 'react';

const ports = [
  { port: 22, service: 'SSH', version: 'OpenSSH 8.9p1', state: 'open', risk: 'low' },
  { port: 80, service: 'HTTP', version: 'nginx 1.24.0', state: 'open', risk: 'low' },
  { port: 443, service: 'HTTPS', version: 'nginx 1.24.0', state: 'open', risk: 'low' },
  { port: 3000, service: 'Node.js', version: 'Express 4.18.2', state: 'open', risk: 'medium' },
  { port: 3306, service: 'MySQL', version: '8.0.35', state: 'open', risk: 'high' },
  { port: 5432, service: 'PostgreSQL', version: '16.1', state: 'filtered', risk: 'medium' },
  { port: 6379, service: 'Redis', version: '7.2.3', state: 'open', risk: 'high' },
  { port: 8080, service: 'HTTP-Alt', version: 'unknown', state: 'closed', risk: 'info' },
];

const vulns = [
  { id: 'CVE-2024-1234', severity: 'high', service: 'MySQL 8.0.35', desc: 'Remote code execution via crafted query' },
  { id: 'CVE-2024-5678', severity: 'medium', service: 'Redis 7.2.3', desc: 'Unauthenticated access to sensitive data' },
  { id: 'CVE-2024-9012', severity: 'low', service: 'Express 4.18.2', desc: 'Open redirect in query parsing' },
];

export default function ScannerDemo() {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  function scan() {
    setScanning(true); setProgress(0); setDone(false);
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(t); setScanning(false); setDone(true); return 100; }
        return p + 4;
      });
    }, 80);
  }

  return (
    <div className="liquid-glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#f87171]/15 flex items-center justify-center text-sm">ðŸ›¡</div>
          <div>
            <h3 className="text-sm font-semibold">PacketGuard</h3>
            <div className="text-[10px] text-[var(--color-text-muted)]">Network Scanner Â· Target: 192.168.1.0/24</div>
          </div>
        </div>
        <button onClick={scan} disabled={scanning}
          className="px-4 py-1.5 rounded-xl text-[11px] font-medium bg-[#4f8fde] text-white disabled:opacity-30 hover:bg-[#60a5fa] hover:shadow-[0_4px_16px_rgba(96,165,250,0.2)] transition-all cursor-pointer">
          {done ? 'Rescan' : scanning ? `Scanning ${progress}%` : 'Scan Network'}
        </button>
      </div>

      {(scanning || done) && (
        <>
          <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#60a5fa] to-[#34d399] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <div className="space-y-1">
            <div className="grid grid-cols-6 text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider px-2 pb-1">
              <span>Port</span><span className="col-span-2">Service</span><span>Version</span><span>State</span><span>Risk</span>
            </div>
            {ports.map((p) => (
              <div key={p.port} className="grid grid-cols-6 items-center px-3 py-2 bg-white/[0.015] rounded-lg border border-white/[0.03] text-[11px]">
                <span className="font-mono text-white">{p.port}</span>
                <span className="col-span-2 text-[var(--color-text-secondary)]">{p.service}</span>
                <span className="text-[var(--color-text-muted)] text-[10px]">{p.version}</span>
                <span className={p.state === 'open' ? 'text-green-400' : p.state === 'filtered' ? 'text-yellow-400' : 'text-[var(--color-text-muted)]'}>{p.state}</span>
                <span className={p.risk === 'high' ? 'text-red-400' : p.risk === 'medium' ? 'text-yellow-400' : p.risk === 'low' ? 'text-green-400' : 'text-[var(--color-text-muted)]'}>{p.risk}</span>
              </div>
            ))}
          </div>

          {done && (
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-[var(--color-text-secondary)]">Vulnerabilities Found</p>
              {vulns.map((v) => (
                <div key={v.id} className="flex items-start gap-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${v.severity === 'high' ? 'bg-red-400' : v.severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-[#60a5fa]">{v.id}</span>
                      <span className={`text-[10px] uppercase font-bold ${v.severity === 'high' ? 'text-red-400' : v.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'}`}>{v.severity}</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{v.desc}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">Service: {v.service}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!scanning && !done && (
        <div className="text-center py-12 text-[var(--color-text-muted)] text-[12px]">
          Click "Scan Network" to begin vulnerability assessment
        </div>
      )}
    </div>
  );
}

