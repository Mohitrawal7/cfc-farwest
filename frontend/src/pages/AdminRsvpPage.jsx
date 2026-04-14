import { useEffect, useState } from 'react';
import { ClipboardList, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllEvents, getMembers, getRsvpsByEvent, getRsvpCount, upsertRsvp } from '../services/api';
import { format } from 'date-fns';

const STATUS_STYLES = {
  CONFIRMED: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  DECLINED:  'bg-red-50 text-red-600 border-red-200',
  MAYBE:     'bg-amber-50 text-amber-700 border-amber-200',
  NONE:      'bg-slate-100 text-slate-400 border-slate-200',
};

const STATUS_ICONS = {
  CONFIRMED: CheckCircle,
  DECLINED:  XCircle,
  MAYBE:     AlertCircle,
};

export default function AdminRsvpPage() {
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [rsvpMap, setRsvpMap] = useState({});
  const [countData, setCountData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    Promise.all([getAllEvents(), getMembers()])
      .then(([eRes, mRes]) => {
        setEvents(eRes.data.filter(e => e.status === 'UPCOMING' || e.status === 'ONGOING'));
        setMembers(mRes.data);
      });
  }, []);

  const loadRsvps = (eventId) => {
    setLoading(true);
    Promise.all([getRsvpsByEvent(eventId), getRsvpCount(eventId)])
      .then(([rRes, cRes]) => {
        const map = {};
        rRes.data.forEach(r => { map[r.member.id] = r.status; });
        setRsvpMap(map);
        setCountData(cRes.data);
      })
      .finally(() => setLoading(false));
  };

  const handleEventChange = (e) => {
    const id = e.target.value;
    setSelectedEvent(id);
    if (id) loadRsvps(id);
  };

  const handleRsvp = async (memberId, status) => {
    setSaving(prev => ({ ...prev, [memberId]: true }));
    try {
      await upsertRsvp(selectedEvent, memberId, status);
      setRsvpMap(prev => ({ ...prev, [memberId]: status }));
      // refresh count
      const cRes = await getRsvpCount(selectedEvent);
      setCountData(cRes.data);
      toast.success(`RSVP updated to ${status}`);
    } catch {
      toast.error('Failed to update RSVP');
    } finally {
      setSaving(prev => ({ ...prev, [memberId]: false }));
    }
  };

  const confirmed = members.filter(m => rsvpMap[m.id] === 'CONFIRMED').length;
  const declined  = members.filter(m => rsvpMap[m.id] === 'DECLINED').length;
  const maybe     = members.filter(m => rsvpMap[m.id] === 'MAYBE').length;
  const noRsvp    = members.filter(m => !rsvpMap[m.id]).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">RSVP Management</h1>
        <p className="text-slate-500 text-sm mt-1">Track member RSVP status. Members must confirm before outer students can join.</p>
      </div>

      {/* Event selector */}
      <div className="card p-5 mb-6">
        <label className="label">Select Upcoming Event</label>
        <select className="input max-w-lg" value={selectedEvent} onChange={handleEventChange}>
          <option value="">— Choose an event —</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.title} — {format(new Date(ev.eventDate), 'MMM d, yyyy')}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Confirmed', value: confirmed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Declined',  value: declined,  color: 'text-red-600',     bg: 'bg-red-50'     },
              { label: 'Maybe',     value: maybe,     color: 'text-amber-600',   bg: 'bg-amber-50'   },
              { label: 'No RSVP',   value: noRsvp,    color: 'text-slate-500',   bg: 'bg-slate-50'   },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`card p-4 text-center ${bg}`}>
                <div className={`text-2xl font-display font-extrabold ${color}`}>{value}</div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Participation gate notice */}
          {countData && (
            <div className={`rounded-xl p-4 mb-5 flex items-center gap-3 text-sm font-medium ${
              countData.allMembersRsvped
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {countData.allMembersRsvped
                ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                : <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              }
              {countData.allMembersRsvped
                ? `✅ All ${countData.total} members have RSVPed — outer students can now register!`
                : `⚠️ ${confirmed} / ${countData.total} members confirmed. Waiting for ${countData.total - confirmed} more before opening to outside students.`
              }
            </div>
          )}

          {/* Member RSVP table */}
          {loading ? (
            <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="card p-4 animate-pulse h-14" />)}</div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Member','Type','RSVP Status','Update'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {members.map(m => {
                    const status = rsvpMap[m.id];
                    const Icon = STATUS_ICONS[status];
                    return (
                      <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-xs flex-shrink-0">
                              {m.fullName?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{m.fullName}</p>
                              <p className="text-xs text-slate-400">{m.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge bg-slate-100 text-slate-500 text-xs">{m.memberType?.replace('_',' ')}</span>
                        </td>
                        <td className="px-4 py-3">
                          {status ? (
                            <span className={`badge border ${STATUS_STYLES[status]} flex items-center gap-1 w-fit`}>
                              {Icon && <Icon className="w-3 h-3" />}
                              {status}
                            </span>
                          ) : (
                            <span className="badge bg-slate-100 text-slate-400">No RSVP</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            {['CONFIRMED','DECLINED','MAYBE'].map(s => (
                              <button key={s} disabled={saving[m.id]}
                                onClick={() => handleRsvp(m.id, s)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50 ${status === s ? STATUS_STYLES[s] : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                                {s[0] + s.slice(1).toLowerCase()}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {!selectedEvent && (
        <div className="text-center py-20 text-slate-400">
          <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Select an upcoming event to manage RSVPs</p>
        </div>
      )}
    </div>
  );
}
