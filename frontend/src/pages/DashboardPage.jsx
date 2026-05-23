import React, { useEffect, useState } from 'react';
import { getDashboardStats, getTodayAppointments } from '../api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [todayAppts, setTodayAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getTodayAppointments()])
      .then(([s, a]) => { setStats(s.data); setTodayAppts(a.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const statusColor = (s) => `badge badge-${s?.toLowerCase()}`;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
        <span style={{ fontSize: 12, color: '#64748b' }}>{new Date().toDateString()}</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-num">{stats?.totalPatients ?? 0}</div>
          <div className="stat-label">Total Patients</div>
        </div>
        <div className="stat-card green">
          <div className="stat-num">{stats?.totalDoctors ?? 0}</div>
          <div className="stat-label">Active Doctors</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-num">{stats?.todayAppointments ?? 0}</div>
          <div className="stat-label">Today's Appointments</div>
        </div>
        <div className="stat-card red">
          <div className="stat-num">{stats?.pendingAppointments ?? 0}</div>
          <div className="stat-label">Pending Appointments</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-num">₹{Number(stats?.totalRevenue ?? 0).toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>📅 Today's Appointments</h3>
          <span style={{ fontSize: 12, color: '#64748b' }}>{todayAppts.length} appointments</span>
        </div>
        {todayAppts.length === 0 ? (
          <div className="empty">No appointments scheduled for today</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Appt ID</th><th>Patient</th><th>Doctor</th>
                  <th>Time</th><th>Reason</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAppts.map((a) => (
                  <tr key={a.id}>
                    <td><code style={{ fontSize: 11 }}>{a.appointmentId}</code></td>
                    <td><strong>{a.patientName}</strong></td>
                    <td>{a.doctorName}</td>
                    <td>{a.appointmentTime}</td>
                    <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.reason}</td>
                    <td><span className={statusColor(a.status)}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
