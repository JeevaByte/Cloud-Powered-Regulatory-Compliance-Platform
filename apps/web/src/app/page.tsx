import { ApiHealthBadge } from '@/components/ApiHealthBadge';

export default function HomePage() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>🛡️ Cloud-Powered Regulatory Compliance Platform</h1>
      <p>
        Streamline your compliance journey with automated control mapping, evidence collection,
        and real-time compliance dashboards.
      </p>

      <section style={{ marginTop: '2rem' }}>
        <h2>System Status</h2>
        <ApiHealthBadge />
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Supported Frameworks</h2>
        <ul>
          <li>SOC 2 Type II</li>
          <li>ISO 27001</li>
          <li>GDPR</li>
          <li>HIPAA</li>
          <li>PCI DSS</li>
        </ul>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Getting Started</h2>
        <p>
          See the <a href="https://github.com/JeevaByte/Cloud-Powered-Regulatory-Compliance-Platform">documentation</a> for setup instructions.
        </p>
      </section>
    </main>
  );
}
