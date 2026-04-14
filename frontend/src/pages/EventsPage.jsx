import { useEffect, useState } from 'react';
import { Calendar, Search } from 'lucide-react';
import EventCard from '../components/EventCard';
import { getAllEvents } from '../services/api';

const TYPES = ['ALL', 'WORKSHOP', 'WEBINAR', 'HACKATHON', 'COMPETITION', 'MENTORSHIP_SESSION'];
const TYPE_LABELS = {
  ALL: 'All', WORKSHOP: 'Workshops', WEBINAR: 'Webinars',
  HACKATHON: 'Hackathons', COMPETITION: 'Competitions', MENTORSHIP_SESSION: 'Mentorship'
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tab, setTab] = useState('ALL');
  const [statusTab, setStatusTab] = useState('UPCOMING');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllEvents()
      .then(r => { setEvents(r.data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = events;
    if (statusTab !== 'ALL') result = result.filter(e => e.status === statusTab);
    if (tab !== 'ALL') result = result.filter(e => e.eventType === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q) ||
        e.mentorName?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [events, tab, statusTab, search]);

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title mb-1">Events</h1>
        <p className="text-slate-500">All CFC FarWest events — workshops, hackathons, webinars &amp; mentorship sessions</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['UPCOMING', 'COMPLETED', 'ALL'].map(s => (
          <button
            key={s}
            onClick={() => setStatusTab(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusTab === s
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300'
            }`}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Type filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-1.5 flex-wrap">
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                tab === t
                  ? 'bg-brand-100 text-brand-700'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input pl-9 w-full sm:w-56"
            placeholder="Search events…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card p-5 animate-pulse h-52">
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
              <div className="h-6 bg-slate-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No events found</p>
          <p className="text-sm mt-1">Try a different filter or search term</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  );
}
