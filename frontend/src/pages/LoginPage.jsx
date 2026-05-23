import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../store/slices/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏥</div>
          <h1>Hospital Management</h1>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text" placeholder="Enter username" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })} required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" placeholder="Enter password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required
            />
          </div>
          {error && <p className="error-msg" style={{ marginBottom: 12 }}>❌ {error}</p>}
          <button className="btn btn-primary" type="submit" style={{ width: '100%', padding: '10px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div style={{ marginTop: 20, padding: 12, background: '#f8fafc', borderRadius: 6, fontSize: 12, color: '#64748b' }}>
          <strong>Demo credentials:</strong><br />
          Admin: admin / admin123<br />
          Doctor: doctor / doctor123
        </div>
      </div>
    </div>
  );
}
