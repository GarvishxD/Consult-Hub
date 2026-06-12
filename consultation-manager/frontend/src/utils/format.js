export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatFileName(name) {
  if (!name) return '—';
  const parts = name.split('_');
  return parts.length > 1 ? parts.slice(1).join('_') : name;
}

export function toDateTimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function splitDateTime(value) {
  if (!value) return { date: '', time: '' };
  const local = toDateTimeLocal(value);
  const [date, time] = local.split('T');
  return { date: date || '', time: time || '' };
}

export function defaultDateTime() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return {
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
  };
}

export function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
