import React, { useEffect, useState, useCallback } from 'react';
import { getAppointments, createAppointment, updateAppointmentStatus, cancelAppointment, getDoctors, getPatients } from '../api';
import { toast } from 'react-toastify';

const STATUS_OPTIONS = ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'NO_SHOW'];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [statusModal, setStatusModal] = useState(null);
  const [form, setForm] = useState({ patientId: '', doctorId: '', appointmentDate: '', appointmentTime: '', reason: '' });
  const [statusForm, setStatusForm] = useState({ status: '', notes: '', prescription: '', diagnosis: '' });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getAppointments(page, 10);
      setAppointments(data.content);
      setTotalPages(data.totalPages);
    } catch { toast.error('Failed to load appointments'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => {
    getDoctors(0, 100).then(r => setDoctors(r.data.content || []));
    getPatients(0, 100).then(r => setPatients(r.data.content || []));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAppointment(form);
      toast.success('Appointment booked!');
      setShowModal(false); fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Error booking appointment'); }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateAppointmentStatus(statusModal.id, statusForm);
      toast.success('Status updated!');
      setStatusModal(null); fetchAll();
    } catch { toast.error('Failed to update status'); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try { await cancelAppointment(id); toast.success('Appointment cancelled'); fetchAll(); }
    catch { toast.error('Failed to cancel'); }
  };

  const statusColor = (s) => `badge badge-${s?.toLowerCase()}`;
  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const sf = (field) => (e) => setStatusForm({ ...statusForm, [field]: e.target.value });

  return (
    <div>
      <div className="page-header">
        <div><h2>Appointments</h2><p>Schedule and manage appointments</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Book Appointment</button>
      </div>

      <div className="card">
        {loading ? <div className="loading">Loading...</div> : (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {appointments.length === 0
                    ? <tr><td colSpan={7} className="empty">No appointments found</td></tr>
                    : appointments.map((a) => (
                      <tr key={a.id}>
                        <td><code style={{ fontSize: 11, color: '#3b82f6' }}>{a.appointmentId}</code></td>
                        <td><strong>{a.patientName}</strong></td>
                        <td>{a.doctorName}<br /><span style={{ fontSize: 11, color: '#64748b' }}>{a.specialization}</span></td>
                        <td>{a.appointmentDate}</td>
                        <td>{a.appointmentTime}</td>
                        <td><span className={statusColor(a.status)}>{a.status}</span></td>
                        <td style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-outline btn-sm" onClick={() => { setStatusModal(a); setStatusForm({ status: a.status, notes: a.notes || '', prescription: a.prescription || '', diagnosis: a.diagnosis || '' }); }}>Update</button>
                          {a.status === 'SCHEDULED' && <button className="btn btn-danger btn-sm" onClick={() => handleCancel(a.id)}>Cancel</button>}
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

      {/* Book Appointment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Book Appointment</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group"><label>Patient *</label>
                <select value={form.patientId} onChange={f('patientId')} required>
                  <option value="">Select patient</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.patientId} — {p.firstName} {p.lastName}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Doctor *</label>
                <select value={form.doctorId} onChange={f('doctorId')} required>
                  <option value="">Select doctor</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} ({d.specialization})</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Date *</label><input type="date" value={form.appointmentDate} onChange={f('appointmentDate')} required /></div>
                <div className="form-group"><label>Time *</label><input type="time" value={form.appointmentTime} onChange={f('appointmentTime')} required /></div>
              </div>
              <div className="form-group"><label>Reason</label><input value={form.reason} onChange={f('reason')} placeholder="Chief complaint" /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Book Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {statusModal && (
        <div className="modal-overlay" onClick={() => setStatusModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Update Appointment — {statusModal.appointmentId}</h2>
            <form onSubmit={handleStatusUpdate}>
              <div className="form-group"><label>Status</label>
                <select value={statusForm.status} onChange={sf('status')}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Diagnosis</label><input value={statusForm.diagnosis} onChange={sf('diagnosis')} /></div>
              <div className="form-group"><label>Prescription</label><textarea rows={3} value={statusForm.prescription} onChange={sf('prescription')} /></div>
              <div className="form-group"><label>Notes</label><textarea rows={2} value={statusForm.notes} onChange={sf('notes')} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setStatusModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
