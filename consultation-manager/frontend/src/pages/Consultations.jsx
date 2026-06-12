import { useCallback, useEffect, useState } from 'react';
import { clientApi, consultationApi } from '../api';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import { defaultDateTime, formatDate, splitDateTime } from '../utils/format';

const emptyForm = { clientId: '', date: '', time: '', remarks: '' };

export default function Consultations() {
  const { showToast } = useToast();
  const [consultations, setConsultations] = useState([]);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [recordingCounts, setRecordingCounts] = useState({});

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [clientList, consultationList] = await Promise.all([
        clientApi.getAll(),
        search.trim()
          ? consultationApi.search(search.trim())
          : consultationApi.getAll(),
      ]);

      setClients(clientList);
      setConsultations(consultationList);

      const counts = {};
      await Promise.all(
        consultationList.map(async (c) => {
          counts[c.id] = await consultationApi.recordingCount(c.id);
        })
      );
      setRecordingCounts(counts);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => {
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [loadData]);

  function openCreate() {
    if (clients.length === 0) {
      showToast('Add a client first before creating a consultation', 'error');
      return;
    }
    const { date, time } = defaultDateTime();
    setEditing(null);
    setForm({
      ...emptyForm,
      clientId: String(clients[0].id),
      date,
      time,
    });
    setModalOpen(true);
  }

  function openEdit(consultation) {
    const { date, time } = splitDateTime(consultation.consultationDate);
    setEditing(consultation);
    setForm({
      clientId: String(consultation.clientId || ''),
      date,
      time,
      remarks: consultation.remarks || '',
    });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!editing && !form.clientId) {
      showToast('Please select a client', 'error');
      return;
    }

    if (!form.date) {
      showToast('Please select a date', 'error');
      return;
    }

    if (!form.time) {
      showToast('Please select a time', 'error');
      return;
    }

    const payload = {
      consultationDate: `${form.date}T${form.time}:00`,
      remarks: form.remarks,
    };

    try {
      if (editing) {
        await consultationApi.update(editing.id, payload);
        showToast('Consultation updated');
      } else {
        await consultationApi.create(form.clientId, payload);
        showToast('Consultation created');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this consultation?')) return;
    try {
      await consultationApi.remove(id);
      showToast('Consultation deleted');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <div className="page">
      <PageHeader
        title="Consultations"
        subtitle="Schedule and manage client consultations"
        action={
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            + New Consultation
          </button>
        }
      />

      <div className="toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder="Search by client name or remarks..."
        />
        <span className="badge">{consultations.length} total</span>
      </div>

      <div className="panel table-panel">
        {loading ? (
          <p className="muted center">Loading consultations...</p>
        ) : consultations.length === 0 ? (
          <EmptyState icon="◉" title="No consultations" message="Create a consultation for one of your clients" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Date & Time</th>
                <th>Remarks</th>
                <th>Recordings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((c) => (
                <tr key={c.id}>
                  <td><span className="id-badge">#{c.id}</span></td>
                  <td><strong>{c.clientName || '—'}</strong></td>
                  <td>{formatDate(c.consultationDate)}</td>
                  <td className="remarks-cell">{c.remarks || '—'}</td>
                  <td><span className="count-pill">{recordingCounts[c.id] ?? 0}</span></td>
                  <td className="actions">
                    <button type="button" className="btn btn-ghost" onClick={() => openEdit(c)}>Edit</button>
                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Consultation' : 'New Consultation'} onClose={() => setModalOpen(false)}>
          <form className="form" onSubmit={handleSubmit} noValidate>
            {!editing && (
              <label>
                Client
                <select
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                >
                  <option value="">Select a client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.email}</option>
                  ))}
                </select>
              </label>
            )}
            <div className="datetime-row">
              <label>
                Date
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </label>
              <label>
                Time
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </label>
            </div>
            <p className="field-hint">Pick both a date and a time for the consultation.</p>
            <label>
              Remarks
              <textarea
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                rows={3}
                placeholder="Session notes, topics discussed..."
              />
            </label>
            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
