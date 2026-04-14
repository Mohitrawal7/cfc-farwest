import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Archive } from 'lucide-react';
import EventCard from '../components/EventCard';
import { getPastEvents } from '../services/api';

export default function ActivitiesPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPastEvents()
      .then(r => setEvents(r.data))
      .finally(() => setLoading(false));
  }, []);

  // Group by year
  const grouped = events.reduce((acc, e) => {
    const yr = new Date(e.eventDate).getFullYear();
    if (!acc[yr]) acc[yr] = [];
    acc[yr].push(e);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => b - a);

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title mb-1">Past Activities</h1>
        <p className="text-slate-500">A record of everything CFC FarWest has done</p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card p-5 animate-pulse h-48">
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
              <div className="h-6 bg-slate-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Archive className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No past activities yet.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {years.map(yr => (
            <div key={yr}>
              <div className="flex items-center gap-3 mb-5">
                <span className="font-display font-extrabold text-2xl text-slate-800">{yr}</span>
                <span className="badge bg-slate-100 text-slate-500">{grouped[yr].length} events</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {grouped[yr].map(e => <EventCard key={e.id} event={e} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
