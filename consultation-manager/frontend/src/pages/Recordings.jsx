import { useCallback, useEffect, useState } from 'react';
import { consultationApi, recordingApi } from '../api';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import { formatDate, formatFileName } from '../utils/format';

export default function Recordings() {
  const { showToast } = useToast();
  const [recordings, setRecordings] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [consultationId, setConsultationId] = useState('');
  const [file, setFile] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [consultationList, recordingList] = await Promise.all([
        consultationApi.getAll(),
        search.trim()
          ? recordingApi.search(search.trim())
          : recordingApi.getAll(),
      ]);

      setConsultations(consultationList);
      setRecordings(recordingList);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => {
    if (!consultationId && consultations.length > 0) {
      setConsultationId(String(consultations[0].id));
    }
  }, [consultations, consultationId]);

  useEffect(() => {
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, [loadData]);

  async function handleUpload(e) {
    e.preventDefault();

    if (!consultationId) {
      showToast('Select a consultation first', 'error');
      return;
    }

    if (!file) {
      showToast('Choose a file to upload', 'error');
      return;
    }

    setUploading(true);
    try {
      await recordingApi.upload(consultationId, file);
      showToast('Recording uploaded successfully');
      setFile(null);
      e.target.reset();
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this recording?')) return;
    try {
      await recordingApi.remove(id);
      showToast('Recording deleted');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <div className="page">
      <PageHeader
        title="Recordings"
        subtitle="Upload, search and manage consultation recordings"
      />

      <div className="upload-panel panel">
        <h3>Upload New Recording</h3>
        {consultations.length === 0 ? (
          <p className="muted">Create a consultation before uploading recordings.</p>
        ) : (
          <form className="upload-form" onSubmit={handleUpload}>
            <label>
              Consultation
              <select
                value={consultationId}
                onChange={(e) => setConsultationId(e.target.value)}
                required
              >
                <option value="">Select consultation</option>
                {consultations.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.id} — {c.clientName} ({formatDate(c.consultationDate)})
                  </option>
                ))}
              </select>
            </label>
            <label className="file-input">
              Audio / Video File
              <input
                type="file"
                accept="audio/*,video/*,.mp3,.mp4,.wav,.m4a,.webm"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
              {file && <span className="file-name">{file.name}</span>}
            </label>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Recording'}
            </button>
          </form>
        )}
      </div>

      <div className="toolbar">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch('')}
          placeholder="Search recordings by file name..."
        />
        <span className="badge">{recordings.length} total</span>
      </div>

      <div className="panel table-panel">
        {loading ? (
          <p className="muted center">Loading recordings...</p>
        ) : recordings.length === 0 ? (
          <EmptyState icon="▶" title="No recordings" message="Upload your first recording above" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>File</th>
                <th>Type</th>
                <th>Client</th>
                <th>Consultation</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recordings.map((r) => (
                <tr key={r.id}>
                  <td><span className="id-badge">#{r.id}</span></td>
                  <td><strong>{formatFileName(r.fileName)}</strong></td>
                  <td><span className="type-pill">{r.fileType?.split('/')[0] || 'file'}</span></td>
                  <td>{r.clientName || '—'}</td>
                  <td>#{r.consultationId}</td>
                  <td>{formatDate(r.uploadedAt)}</td>
                  <td className="actions">
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => recordingApi.download(r.id, r.fileName)}
                    >
                      Download
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(r.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
