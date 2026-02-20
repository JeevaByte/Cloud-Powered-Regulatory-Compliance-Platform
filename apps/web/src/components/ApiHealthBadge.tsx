async function getApiHealth(): Promise<{ status: string } | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  try {
    const res = await fetch(`${apiUrl}/healthz`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return { status: 'degraded' };
    const data = await res.json();
    return { status: data.status ?? 'unknown' };
  } catch {
    return { status: 'offline' };
  }
}

export async function ApiHealthBadge() {
  const health = await getApiHealth();
  const status = health?.status ?? 'unknown';

  const color =
    status === 'ok' ? '#22c55e' : status === 'offline' ? '#ef4444' : '#f59e0b';

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
