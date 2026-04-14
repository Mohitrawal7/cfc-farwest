import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE ;

const api = axios.create({ baseURL: API_BASE });

// Attach JWT token on every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cfc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cfc_token');
      localStorage.removeItem('cfc_admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────
export const login = (username, password) =>
  api.post('/auth/login', { username, password });

// ─── Events ─────────────────────────────────────────────
export const getUpcomingEvents = () => api.get('/events/upcoming');
export const getPastEvents     = () => api.get('/events/past');
export const getAllEvents       = () => api.get('/events');
export const getEventById      = (id) => api.get(`/events/${id}`);
export const createEvent       = (data) => api.post('/events', data);
export const updateEvent       = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent       = (id) => api.delete(`/events/${id}`);

// ─── Members ─────────────────────────────────────────────
export const getMembers      = () => api.get('/members');
export const getAllMembers    = () => api.get('/members/all');
export const getMemberById   = (id) => api.get(`/members/${id}`);
export const getMemberStats  = () => api.get('/members/stats');
export const createMember    = (data) => api.post('/members', data);
export const updateMember    = (id, data) => api.put(`/members/${id}`, data);
export const deleteMember    = (id) => api.delete(`/members/${id}`);

// ─── Attendance ───────────────────────────────────────────
export const getAttendanceByEvent  = (eventId) => api.get(`/attendance/event/${eventId}`);
export const getAttendanceSummary  = (eventId) => api.get(`/attendance/event/${eventId}/summary`);
export const markAttendance        = (eventId, memberId, status, note) =>
  api.post(`/attendance/event/${eventId}/member/${memberId}`, { status, note });
export const bulkMarkAttendance    = (eventId, list) =>
  api.post(`/attendance/event/${eventId}/bulk`, list);

// ─── RSVP ─────────────────────────────────────────────────
export const getRsvpsByEvent    = (eventId) => api.get(`/rsvp/event/${eventId}`);
export const getRsvpCount       = (eventId) => api.get(`/rsvp/event/${eventId}/confirmed-count`);
export const upsertRsvp         = (eventId, memberId, status) =>
  api.post(`/rsvp/event/${eventId}/member/${memberId}`, { status });

export default api;
