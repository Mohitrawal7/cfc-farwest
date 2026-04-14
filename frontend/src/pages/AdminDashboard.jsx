import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, CheckSquare, ClipboardList, ArrowRight, TrendingUp } from 'lucide-react';
import { getAllEvents, getMemberStats, getMembers } from '../services/api';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMemberStats(), getAllEvents()])
      .then(([sRes, eRes]) => {
        setStats(sRes.data);
        setEvents(eRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const upcoming = events.filter(e => e.status === 'UPCOMING').slice(0, 5);
  const recent   = events.filter(e => e.status === 'COMPLETED').slice(0, 5);

  const statCards = stats ? [
    { label: 'Total Members', value: stats.total, icon: Users, color: 'bg-brand-50 text-brand-600', link: '/admin/members' },
    { label: 'Executives', value: stats.executives, icon: TrendingUp, color: 'bg-purple-50 text-purple-600', link: '/admin/members' },
    { label: 'College Reps', value: stats.collegeReps, icon: Users, color: 'bg-emerald-50 text-emerald-600', link: '/admin/members' },
    { label: 'General Members', value: stats.general, icon: Users, color: 'bg-amber-50 text-amber-600', link: '/admin/members' },
    { label: 'Total Events', value: events.length, icon: Calendar, color: 'bg-blue-50 text-blue-600', link: '/admin/events' },
    { label: 'Upcoming Events', value: upcoming.length, icon: Calendar, color: 'bg-green-50 text-green-600', link: '/admin/events' },
  ] : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">CFC FarWest operations overview</p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card p-5 animate-pulse h-24">
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-3" />
              <div className="h-7 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color, link }) => (
            <Link key={label} to={link} className="card p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="font-display text-3xl font-extrabold text-slate-900">{value}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming events */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-slate-900">Upcoming Events</h2>
            <Link to="/admin/events" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map(e => (
                <div key={e.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="w-9 h-9 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{e.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {format(new Date(e.eventDate), 'MMM d, yyyy · h:mm a')}
                    </p>
                  </div>
                  <span className="badge bg-emerald-50 text-emerald-700 ml-auto flex-shrink-0">
                    {e.eventType?.replace('_SESSION', '')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activities */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-slate-900">Recent Activities</h2>
            <Link to="/admin/attendance" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              View Attendance <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No completed events yet</p>
          ) : (
            <div className="space-y-3">
              {recent.map(e => (
                <div key={e.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="w-9 h-9 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckSquare className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{e.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {format(new Date(e.eventDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <span className="badge bg-slate-100 text-slate-500 ml-auto flex-shrink-0">Done</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/admin/events', label: 'Add Event', icon: Calendar },
          { to: '/admin/members', label: 'Add Member', icon: Users },
          { to: '/admin/attendance', label: 'Mark Attendance', icon: CheckSquare },
          { to: '/admin/rsvp', label: 'View RSVPs', icon: ClipboardList },
        ].map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to}
            className="card p-4 flex flex-col items-center gap-2 text-center hover:border-brand-200 hover:bg-brand-50 transition-colors group">
            <Icon className="w-6 h-6 text-brand-500 group-hover:text-brand-600" />
            <span className="text-xs font-semibold text-slate-600 group-hover:text-brand-700">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
