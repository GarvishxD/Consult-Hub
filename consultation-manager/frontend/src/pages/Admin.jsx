import { useEffect, useState } from 'react';
import { adminApi } from '../api';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { downloadCsv, formatDate, formatFileName } from '../utils/format';

export default function Admin() {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi.getStats()
      .then(setStats)
      .catch((err) => showToast(err.message, 'error'));
  }, [showToast]);

  function exportClients() {
    if (!stats?.recentClients) return;
    downloadCsv('clients-export.csv', [
      ['ID', 'Name', 'Email', 'Phone'],
      ...stats.recentClients.map((c) => [c.id, c.name, c.email, c.phone]),
    ]);
    showToast('Clients exported');
  }

  function exportConsultations() {
    if (!stats?.recentConsultations) return;
    downloadCsv('consultations-export.csv', [
      ['ID', 'Client', 'Date', 'Remarks'],
      ...stats.recentConsultations.map((c) => [
        c.id, c.clientName, formatDate(c.consultationDate), c.remarks,
      ]),
    ]);
    showToast('Consultations exported');
  }

  function exportRecordings() {
    if (!stats?.recentRecordings) return;
    downloadCsv('recordings-export.csv', [
      ['ID', 'File', 'Client', 'Consultation', 'Uploaded'],
      ...stats.recentRecordings.map((r) => [
        r.id, formatFileName(r.fileName), r.clientName, r.consultationId, formatDate(r.uploadedAt),
      ]),
    ]);
    showToast('Recordings exported');
  }

  return (
    <div className="page admin-page">
      <PageHeader
        title="Admin Panel"
        subtitle="System overview, recent activity and data exports"
      />

      <div className="stat-grid">
        <StatCard label="Total Clients" value={stats?.totalClients} icon="◎" accent="teal" />
        <StatCard label="Total Consultations" value={stats?.totalConsultations} icon="◉" accent="pink" />
        <StatCard label="Total Recordings" value={stats?.totalRecordings} icon="▶" accent="cream" />
      </div>

      <div className="admin-actions panel">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <button type="button" className="action-card" onClick={exportClients}>
            <span>📥</span>
            <div>
              <strong>Export Clients</strong>
              <p>Download recent clients as CSV</p>
            </div>
          </button>
          <button type="button" className="action-card" onClick={exportConsultations}>
            <span>📥</span>
            <div>
              <strong>Export Consultations</strong>
              <p>Download recent consultations as CSV</p>
            </div>
          </button>
          <button type="button" className="action-card" onClick={exportRecordings}>
            <span>📥</span>
            <div>
              <strong>Export Recordings</strong>
              <p>Download recent recordings as CSV</p>
            </div>
          </button>
        </div>
      </div>

      <div className="admin-grid">
        <section className="panel">
          <h3>Recent Clients</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th></tr>
              </thead>
              <tbody>
                {(stats?.recentClients || []).map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <h3>Recent Consultations</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Client</th><th>Date</th><th>Remarks</th></tr>
              </thead>
              <tbody>
                {(stats?.recentConsultations || []).map((c) => (
                  <tr key={c.id}>
                    <td>{c.clientName}</td>
                    <td>{formatDate(c.consultationDate)}</td>
                    <td>{c.remarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <h3>Recent Recordings</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>File</th><th>Client</th><th>Uploaded</th></tr>
              </thead>
              <tbody>
                {(stats?.recentRecordings || []).map((r) => (
                  <tr key={r.id}>
                    <td>{formatFileName(r.fileName)}</td>
                    <td>{r.clientName}</td>
                    <td>{formatDate(r.uploadedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="panel system-info">
        <h3>System Information</h3>
        <div className="info-grid">
          <div><span>Application</span><strong>ConsultHub v1.0</strong></div>
          <div><span>Backend</span><strong>Spring Boot 4.1</strong></div>
          <div><span>Frontend</span><strong>React + Vite</strong></div>
          <div><span>Database</span><strong>PostgreSQL</strong></div>
        </div>
      </section>
    </div>
  );
}
