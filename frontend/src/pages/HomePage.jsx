import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Award, Zap } from 'lucide-react';
import EventCard from '../components/EventCard';
import { getUpcomingEvents, getMemberStats } from '../services/api';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUpcomingEvents(), getMemberStats()])
      .then(([evRes, stRes]) => {
        setEvents(evRes.data.slice(0, 3));
        setStats(stRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage:'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)', backgroundSize:'48px 48px'}}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6 animate-fade-in">
              <Zap className="w-4 h-4 text-accent-400" />
              Code For Change Nepal · FarWest Region
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight mb-5 animate-fade-up">
              Building Tomorrow's<br />
              <span className="text-accent-400">Tech Leaders</span><br />
              in FarWest Nepal
            </h1>
            <p className="text-brand-100 text-lg mb-8 leading-relaxed animate-fade-up stagger-1">
              We run workshops, hackathons, webinars, and mentorship sessions across the FarWest region —
              connecting students to real-world tech opportunities.
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-up stagger-2">
              <Link to="/events" className="btn-primary bg-accent-500 hover:bg-accent-600 text-white flex items-center gap-2 text-base px-6 py-3">
                See Upcoming Events <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/team" className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 text-base px-6 py-3">
                Meet the Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      {stats && (
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Executive Members', value: stats.executives, icon: Award, color: 'text-brand-600' },
                { label: 'College Representatives', value: stats.collegeReps, icon: Users, color: 'text-purple-600' },
                { label: 'General Members', value: stats.general, icon: Users, color: 'text-emerald-600' },
                { label: 'Total Team Size', value: stats.total, icon: Zap, color: 'text-accent-500' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="text-center">
                  <div className={`text-3xl font-display font-extrabold ${color}`}>{value}</div>
                  <div className="text-sm text-slate-500 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Upcoming Events ── */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="text-slate-500 text-sm mt-1">Don't miss what's coming next</p>
          </div>
          <Link to="/events" className="btn-secondary flex items-center gap-1.5 text-xs">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-5">
            {[1,2,3].map(i => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
                <div className="h-6 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-full mb-1" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No upcoming events right now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {events.map((e, i) => (
              <EventCard key={e.id} event={e} className={`animate-fade-up stagger-${i + 1}`} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA Banner ── */}
      <section className="page-container pt-0">
        <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-xl mb-1">Want to see past activities?</h3>
            <p className="text-brand-200 text-sm">Browse everything we've done — workshops, hackathons, mentorships and more.</p>
          </div>
          <Link to="/activities" className="btn-primary bg-white text-brand-700 hover:bg-brand-50 whitespace-nowrap flex items-center gap-2">
            View Activities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
