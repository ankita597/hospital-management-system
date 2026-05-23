import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';
import Sidebar from './components/common/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import './styles/global.css';

function ProtectedLayout() {
  const { token } = useSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content"><Outlet /></main>
    </div>
  );
}

function DoctorsPage() {
  const [doctors, setDoctors] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [form, setForm] = React.useState({ firstName:'', lastName:'', specialization:'', qualification:'', phone:'', email:'', experienceYears:'', consultationFee:'', availableDays:'', availableTime:'' });
  const f = (field) => (e) => setForm({...form, [field]: e.target.value});

  React.useEffect(() => {
    fetch('http://localhost:8080/api/doctors?page=0&size=100', {
      headers: { Authorization: `Bearer ${localStorage.getItem('hms_token')}` }
    }).then(r => r.json()).then(d => setDoctors(d.content || [])).catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('hms_token')}` },
      body: JSON.stringify(form)
    }).then(r => r.json()).then(d => {
      setDoctors([...doctors, d]);
      setShowModal(false);
      setForm({ firstName:'', lastName:'', specialization:'', qualification:'', phone:'', email:'', experienceYears:'', consultationFee:'', availableDays:'', availableTime:'' });
    }).catch(console.error);
  };

  return (
    <div>
      <div className="page-header">
        <div><h2>Doctors</h2><p>Manage doctor records</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Doctor</button>
      </div>
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Doctor ID</th><th>Name</th><th>Specialization</th>
                <th>Phone</th><th>Experience</th><th>Fee</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length === 0
                ? <tr><td colSpan={6} className="empty">No doctors found</td></tr>
                : doctors.map(d => (
                  <tr key={d.id}>
                    <td><code style={{fontSize:11,color:'#3b82f6'}}>{d.doctorId}</code></td>
                    <td><strong>Dr. {d.firstName} {d.lastName}</strong></td>
                    <td>{d.specialization}</td>
                    <td>{d.phone}</td>
                    <td>{d.experienceYears} yrs</td>
                    <td>₹{d.consultationFee}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add New Doctor</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>First Name *</label><input value={form.firstName} onChange={f('firstName')} required /></div>
                <div className="form-group"><label>Last Name *</label><input value={form.lastName} onChange={f('lastName')} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Specialization *</label><input value={form.specialization} onChange={f('specialization')} required /></div>
                <div className="form-group"><label>Qualification</label><input value={form.qualification} onChange={f('qualification')} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Phone</label><input value={form.phone} onChange={f('phone')} /></div>
                <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={f('email')} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Experience (years)</label><input type="number" value={form.experienceYears} onChange={f('experienceYears')} /></div>
                <div className="form-group"><label>Consultation Fee</label><input value={form.consultationFee} onChange={f('consultationFee')} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Available Days (e.g. MON,TUE)</label><input value={form.availableDays} onChange={f('availableDays')} /></div>
                <div className="form-group"><label>Available Time (e.g. 09:00-17:00)</label><input value={form.availableTime} onChange={f('availableTime')} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BillingPage() {
  const [bills, setBills] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [patients, setPatients] = React.useState([]);
  const [form, setForm] = React.useState({
    patientId:'', consultationFee:'0', medicineCost:'0',
    testCost:'0', otherCharges:'0', discount:'0', notes:''
  });
  const f = (field) => (e) => setForm({...form, [field]: e.target.value});

  const fetchBills = () => {
    fetch('http://localhost:8080/api/bills', {
      headers: { Authorization: `Bearer ${localStorage.getItem('hms_token')}` }
    }).then(r => r.json()).then(d => setBills(Array.isArray(d) ? d : [])).catch(console.error);
  };

  React.useEffect(() => {
    fetchBills();
    fetch('http://localhost:8080/api/patients?page=0&size=100', {
      headers: { Authorization: `Bearer ${localStorage.getItem('hms_token')}` }
    }).then(r => r.json()).then(d => setPatients(d.content || [])).catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('hms_token')}` },
      body: JSON.stringify({
        patientId: parseInt(form.patientId),
        consultationFee: parseFloat(form.consultationFee),
        medicineCost: parseFloat(form.medicineCost),
        testCost: parseFloat(form.testCost),
        otherCharges: parseFloat(form.otherCharges),
        discount: parseFloat(form.discount),
        notes: form.notes
      })
    }).then(r => r.json()).then(() => {
      fetchBills();
      setShowModal(false);
      setForm({ patientId:'', consultationFee:'0', medicineCost:'0', testCost:'0', otherCharges:'0', discount:'0', notes:'' });
    }).catch(console.error);
  };

  const markAsPaid = (bill) => {
    const method = prompt('Payment method?\nType: CASH, CARD, or UPI') || 'CASH';
    fetch(`http://localhost:8080/api/bills/${bill.id}/payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('hms_token')}`
      },
      body: JSON.stringify({ paymentStatus: 'PAID', paymentMethod: method.toUpperCase() })
    }).then(() => fetchBills()).catch(console.error);
  };

  const statusColor = (s) => `badge badge-${s?.toLowerCase()}`;

  const totalRevenue = bills.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalPending = bills.filter(b => b.paymentStatus === 'PENDING').reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div><h2>Billing</h2><p>Manage patient bills and payments</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Bill</button>
      </div>

      {/* Revenue Summary Cards */}
      <div className="stats-grid" style={{marginBottom: 20}}>
        <div className="stat-card green">
          <div className="stat-icon">💰</div>
          <span className="stat-num">₹{totalRevenue.toLocaleString()}</span>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon">⏳</div>
          <span className="stat-num">₹{totalPending.toLocaleString()}</span>
          <div className="stat-label">Pending Amount</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">🧾</div>
          <span className="stat-num">{bills.length}</span>
          <div className="stat-label">Total Bills</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">✅</div>
          <span className="stat-num">{bills.filter(b => b.paymentStatus === 'PAID').length}</span>
          <div className="stat-label">Paid Bills</div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Bill ID</th><th>Patient</th><th>Consultation</th>
                <th>Medicine</th><th>Total</th><th>Status</th>
                <th>Payment Method</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0
                ? <tr><td colSpan={9} className="empty">No bills found</td></tr>
                : bills.map(b => (
                  <tr key={b.id}>
                    <td><code style={{fontSize:11,color:'#1a6fc4'}}>{b.billId}</code></td>
                    <td><strong>{b.patientName}</strong></td>
                    <td>₹{b.consultationFee || 0}</td>
                    <td>₹{b.medicineCost || 0}</td>
                    <td><strong>₹{b.totalAmount || 0}</strong></td>
                    <td><span className={statusColor(b.paymentStatus)}>{b.paymentStatus}</span></td>
                    <td>{b.paymentMethod || '-'}</td>
                    <td>{b.createdAt?.substring(0,10)}</td>
                    <td>
                      {b.paymentStatus === 'PENDING' && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => markAsPaid(b)}
                        >
                          Mark Paid
                        </button>
                      )}
                      {b.paymentStatus === 'PAID' && (
                        <span style={{color:'#10b981', fontSize:12, fontWeight:600}}>✓ Paid</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Create New Bill</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Patient *</label>
                <select value={form.patientId} onChange={f('patientId')} required>
                  <option value="">Select patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.patientId} — {p.firstName} {p.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Consultation Fee (₹)</label><input type="number" value={form.consultationFee} onChange={f('consultationFee')} /></div>
                <div className="form-group"><label>Medicine Cost (₹)</label><input type="number" value={form.medicineCost} onChange={f('medicineCost')} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Test Cost (₹)</label><input type="number" value={form.testCost} onChange={f('testCost')} /></div>
                <div className="form-group"><label>Other Charges (₹)</label><input type="number" value={form.otherCharges} onChange={f('otherCharges')} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Discount (₹)</label><input type="number" value={form.discount} onChange={f('discount')} /></div>
                <div className="form-group"><label>Notes</label><input value={form.notes} onChange={f('notes')} placeholder="Optional notes" /></div>
              </div>
              <div style={{padding:'12px',background:'#f0f6ff',borderRadius:8,fontSize:13,color:'#1a6fc4',marginBottom:4}}>
                <strong>Total: ₹{(
                  parseFloat(form.consultationFee||0) +
                  parseFloat(form.medicineCost||0) +
                  parseFloat(form.testCost||0) +
                  parseFloat(form.otherCharges||0) -
                  parseFloat(form.discount||0)
                ).toFixed(2)}</strong>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Bill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AppRoutes() {
  const { token } = useSelector((s) => s.auth);
  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/"             element={<DashboardPage />} />
        <Route path="/patients"     element={<PatientsPage />} />
        <Route path="/doctors"      element={<DoctorsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/billing"      element={<BillingPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </Provider>
  );
}