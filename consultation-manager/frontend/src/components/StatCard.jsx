export default function StatCard({ label, value, icon, accent }) {
  return (
    <div className={`stat-card accent-${accent}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value ?? '—'}</p>
      </div>
    </div>
  );
}
