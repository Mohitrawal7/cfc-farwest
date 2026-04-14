import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public pages
import HomePage         from './pages/HomePage';
import EventsPage       from './pages/EventsPage';
import EventDetailPage  from './pages/EventDetailPage';
import ActivitiesPage   from './pages/ActivitiesPage';
import TeamPage         from './pages/TeamPage';

// Admin pages
import AdminLoginPage   from './pages/AdminLoginPage';
import AdminLayout      from './pages/AdminLayout';
import AdminDashboard   from './pages/AdminDashboard';
import AdminEventsPage  from './pages/AdminEventsPage';
import AdminMembersPage from './pages/AdminMembersPage';
import AdminAttendancePage from './pages/AdminAttendancePage';
import AdminRsvpPage    from './pages/AdminRsvpPage';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { borderRadius: '12px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#0f8de8', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* ─── Public Routes ─── */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/events" element={<PublicLayout><EventsPage /></PublicLayout>} />
          <Route path="/events/:id" element={<PublicLayout><EventDetailPage /></PublicLayout>} />
          <Route path="/activities" element={<PublicLayout><ActivitiesPage /></PublicLayout>} />
          <Route path="/team" element={<PublicLayout><TeamPage /></PublicLayout>} />

          {/* ─── Admin Login (no sidebar) ─── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ─── Protected Admin Routes ─── */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="events"     element={<AdminEventsPage />} />
            <Route path="members"    element={<AdminMembersPage />} />
            <Route path="attendance" element={<AdminAttendancePage />} />
            <Route path="rsvp"       element={<AdminRsvpPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
