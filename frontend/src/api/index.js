import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('hms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 — redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hms_token');
      localStorage.removeItem('hms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Dashboard
export const getDashboardStats = () => API.get('/dashboard/stats');

// Patients
export const getPatients = (page = 0, size = 10, search = '') =>
  API.get(`/patients?page=${page}&size=${size}&search=${search}`);
export const getPatientById = (id) => API.get(`/patients/${id}`);
export const createPatient = (data) => API.post('/patients', data);
export const updatePatient = (id, data) => API.put(`/patients/${id}`, data);
export const deletePatient = (id) => API.delete(`/patients/${id}`);

// Doctors
export const getDoctors = (page = 0, size = 10, search = '') =>
  API.get(`/doctors?page=${page}&size=${size}&search=${search}`);
export const getDoctorById = (id) => API.get(`/doctors/${id}`);
export const createDoctor = (data) => API.post('/doctors', data);
export const updateDoctor = (id, data) => API.put(`/doctors/${id}`, data);

// Appointments
export const getAppointments = (page = 0, size = 10) =>
  API.get(`/appointments?page=${page}&size=${size}`);
export const getTodayAppointments = () => API.get('/appointments/today');
export const getAppointmentById = (id) => API.get(`/appointments/${id}`);
export const createAppointment = (data) => API.post('/appointments', data);
export const updateAppointmentStatus = (id, data) => API.put(`/appointments/${id}/status`, data);
export const cancelAppointment = (id) => API.delete(`/appointments/${id}/cancel`);

// Bills
export const getBills = () => API.get('/bills');
export const getBillById = (id) => API.get(`/bills/${id}`);
export const createBill = (data) => API.post('/bills', data);
export const updateBillPayment = (id, data) => API.put(`/bills/${id}/payment`, data);

export default API;
