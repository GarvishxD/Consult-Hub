import { useEffect, useState } from 'react';
import { dashboardApi, clientApi, consultationApi, recordingApi } from '../api';
import PageHeader from '../components/PageHeader';
import ServiceLink from '../components/ServiceLink';
import StatCard from '../components/StatCard';
import { formatDate, formatFileName } from '../utils/format';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState({ clients: [], consultations: [], recordings: [] });

  useEffect(() => {
    async function load() {
      const [dashboard, clients, consultations, recordings] = await Promise.all([
        dashboardApi.get(),
        clientApi.getAll(),
        consultationApi.getAll(),
        recordingApi.getAll(),
      ]);

      setStats(dashboard);
      setRecent({
        clients: clients.slice(-3).reverse(),
        consultations: consultations.slice(-3).reverse(),
        recordings: recordings.slice(-3).reverse(),
      });
    }

    load();
  }, []);

  const quickLinks = [
    { to: '/clients', label: 'Add Client', desc: 'Register a new client', icon: '◎' },
    { to: '/consultations', label: 'Schedule', desc: 'Book a consultation', icon: '◉' },
    { to: '/recordings', label: 'Upload', desc: 'Attach a recording', icon: '▶' },
  ];

  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your consultation recording workspace"
      />

      <div className="stat-grid">
        <StatCard label="Total Clients" value={stats?.totalClients} icon="◎" accent="teal" />
        <StatCard label="Consultations" value={stats?.totalConsultations} icon="◉" accent="pink" />
        <StatCard label="Recordings" value={stats?.totalRecordings} icon="▶" accent="cream" />
      </div>

      <div className="quick-links">
        {quickLinks.map((link) => (
          <ServiceLink key={link.to} to={link.to} className="quick-card-dark">
            <span className="quick-icon">{link.icon}</span>
            <div>
              <h4>{link.label}</h4>
              <p>{link.desc}</p>
            </div>
          </ServiceLink>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <h3>Recent Clients</h3>
          {recent.clients.length === 0 ? (
            <p className="muted">No clients yet</p>
          ) : (
            <ul className="activity-list">
              {recent.clients.map((c) => (
                <li key={c.id}>
                  <strong>{c.name}</strong>
                  <span>{c.email}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h3>Recent Consultations</h3>
          {recent.consultations.length === 0 ? (
            <p className="muted">No consultations yet</p>
          ) : (
            <ul className="activity-list">
              {recent.consultations.map((c) => (
                <li key={c.id}>
                  <strong>{c.clientName || 'Unknown'}</strong>
                  <span>{formatDate(c.consultationDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h3>Recent Recordings</h3>
          {recent.recordings.length === 0 ? (
            <p className="muted">No recordings yet</p>
          ) : (
            <ul className="activity-list">
              {recent.recordings.map((r) => (
                <li key={r.id}>
                  <strong>{formatFileName(r.fileName)}</strong>
                  <span>{formatDate(r.uploadedAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
