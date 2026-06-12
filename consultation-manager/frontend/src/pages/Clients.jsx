import { useCallback, useEffect, useState } from 'react';
import { clientApi } from '../api';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';

const emptyForm = { name: '', email: '', phone: '' };

export default function Clients() {
  const { showToast } = useToast();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(0);
  const pageSize = 8;

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = search.trim()
        ? await clientApi.search(search.trim())
        : await clientApi.getAll();
      setClients(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => {
    const timer = setTimeout(loadClients, 300);
    return () => clearTimeout(timer);
  }, [loadClients]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(client) {
    setEditing(client);
    setForm({ name: client.name, email: client.email, phone: client.phone });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await clientApi.update(editing.id, form);
        showToast('Client updated successfully');
      } else {
        await clientApi.create(form);
        showToast('Client added successfully');
      }
      setModalOpen(false);
      loadClients();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this client?')) return;
    try {
      await clientApi.remove(id);
      showToast('Client deleted');
      loadClients();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  const totalPages = Math.max(1, Math.ceil(clients.length / pageSize));
  const paged = clients.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="page">
      <PageHeader
        title="Clients"
        subtitle="Manage your client directory"
        action={
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            + Add Client
          </button>
        }
      />

      <div className="toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder="Search clients by name..."
        />
        <span className="badge">{clients.length} total</span>
      </div>

      <div className="panel table-panel">
        {loading ? (
          <p className="muted center">Loading clients...</p>
        ) : paged.length === 0 ? (
          <EmptyState icon="◎" title="No clients found" message="Add your first client to get started" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((client) => (
                <tr key={client.id}>
                  <td><span className="id-badge">#{client.id}</span></td>
                  <td><strong>{client.name}</strong></td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td className="actions">
                    <button type="button" className="btn btn-ghost" onClick={() => openEdit(client)}>Edit</button>
                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(client.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {clients.length > pageSize && (
          <div className="pagination">
            <button type="button" className="btn btn-ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
            <span>Page {page + 1} of {totalPages}</span>
            <button type="button" className="btn btn-ghost" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Client' : 'Add Client'} onClose={() => setModalOpen(false)}>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label>
              Phone
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </label>
            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
