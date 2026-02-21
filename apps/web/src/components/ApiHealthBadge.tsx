import type { HealthCheckResponse } from '@compliance/shared';

async function getApiHealth(): Promise<Pick<HealthCheckResponse, 'status'> | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  try {
    const res = await fetch(`${apiUrl}/healthz`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const data: HealthCheckResponse = await res.json();
    return { status: data.status };
  } catch {
    return null;
  }
}

export async function ApiHealthBadge() {
  const health = await getApiHealth();
  const status = health?.status ?? 'error';

  const color = status === 'ok' ? '#22c55e' : '#ef4444';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: color,
          display: 'inline-block',
        }}
      />
      <span>
        API: <strong>{status}</strong>
      </span>
    </div>
  );
}
