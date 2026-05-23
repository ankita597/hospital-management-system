import React, { useEffect, useState, useCallback } from 'react';
import { getPatients, createPatient, updatePatient, deletePatient } from '../api';
import { toast } from 'react-toastify';

const EMPTY_FORM = {
  firstName: '', lastName: '', gender: '', dateOfBirth: '',
  bloodGroup: '', phone: '', email: '', address: '',
  emergencyContact: '', emergencyPhone: '', medicalHistory: '', allergies: ''
};

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getPatients(page, 10, search);
      setPatients(data.content);
      setTotalPages(data.totalPages);
    } catch { toast.error('Failed to load patients'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ ...p, dateOfBirth: p.dateOfBirth || '' });
    setEditingId(p.id); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      if (editingId) { await updatePatient(editingId, form); toast.success('Patient updated!'); }
      else { await createPatient(form); toast.success('Patient registered!'); }
      setShowModal(false); fetchPatients();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving patient'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete patient ${name}?`)) return;
    try { await deletePatient(id); toast.success('Patient deleted'); fetchPatients(); }
    catch { toast.error('Failed to delete'); }
  };

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div>
      <div className="page-header">
        <div><h2>Patients</h2><p>Manage patient records</p></div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Patient</button>
      </div>

      <div className="card">
        <div className="search-bar">
          <input placeholder="Search by name, ID, or phone..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
        </div>

        {loading ? <div className="loading">Loading...</div> : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Patient ID</th><th>Name</th><th>Gender</th><th>Blood</th><th>Phone</th><th>Email</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr><td colSpan={7} className="empty">No patients found</td></tr>
                  ) : patients.map((p) => (
                    <tr key={p.id}>
                      <td><code style={{ fontSize: 11, color: '#3b82f6' }}>{p.patientId}</code></td>
                      <td><strong>{p.firstName} {p.lastName}</strong></td>
                      <td>{p.gender}</td>
                      <td><span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>{p.bloodGroup}</span></td>
                      <td>{p.phone}</td>
                      <td>{p.email}</td>
                      <td style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, `${p.firstName} ${p.lastName}`)}>Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>Page {page + 1} of {totalPages || 1}</span>
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Patient' : 'Register New Patient'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>First Name *</label><input value={form.firstName} onChange={f('firstName')} required /></div>
                <div className="form-group"><label>Last Name *</label><input value={form.lastName} onChange={f('lastName')} required /></div>
              </div>
              <div className="form-row three">
                <div className="form-group"><label>Gender</label>
                  <select value={form.gender} onChange={f('gender')}>
                    <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="form-group"><label>Date of Birth</label><input type="date" value={form.dateOfBirth} onChange={f('dateOfBirth')} /></div>
                <div className="form-group"><label>Blood Group</label>
                  <select value={form.bloodGroup} onChange={f('bloodGroup')}>
                    <option value="">Select</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Phone *</label><input value={form.phone} onChange={f('phone')} required /></div>
                <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={f('email')} /></div>
              </div>
              <div className="form-group"><label>Address</label><input value={form.address} onChange={f('address')} /></div>
              <div className="form-row">
                <div className="form-group"><label>Emergency Contact</label><input value={form.emergencyContact} onChange={f('emergencyContact')} /></div>
                <div className="form-group"><label>Emergency Phone</label><input value={form.emergencyPhone} onChange={f('emergencyPhone')} /></div>
              </div>
              <div className="form-group"><label>Medical History</label><textarea rows={2} value={form.medicalHistory} onChange={f('medicalHistory')} /></div>
              <div className="form-group"><label>Allergies</label><input value={form.allergies} onChange={f('allergies')} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Patient'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
