import { useEffect, useState } from 'react';
import { CheckSquare, Search, Save, Users, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllEvents, getMembers, getAttendanceByEvent, getAttendanceSummary, bulkMarkAttendance } from '../services/api';
import { format } from 'date-fns';

const STATUS_COLORS = {
  PRESENT: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  ABSENT:  'bg-red-50 text-red-600 border-red-200',
  EXCUSED: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function AdminAttendancePage() {
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [attendance, setAttendance] = useState({});  // { memberId: { status, note } }
  const [summary, setSummary] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([getAllEvents(), getMembers()])
      .then(([eRes, mRes]) => {
        setEvents(eRes.data.filter(e => e.status !== 'CANCELLED'));
        setMembers(mRes.data);
      });
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    setLoading(true);
    Promise.all([getAttendanceByEvent(selectedEvent), getAttendanceSummary(selectedEvent)])
      .then(([aRes, sRes]) => {
        const map = {};
        aRes.data.forEach(a => {
          map[a.member.id] = { status: a.status, note: a.note || '' };
        });
        // Default unset members to ABSENT
        members.forEach(m => {
          if (!map[m.id]) map[m.id] = { status: 'ABSENT', note: '' };
        });
        setAttendance(map);
        setSummary(sRes.data);
      })
      .finally(() => setLoading(false));
  }, [selectedEvent]);

  const setStatus = (memberId, status) =>
    setAttendance(prev => ({ ...prev, [memberId]: { ...prev[memberId], status } }));

  const setNote = (memberId, note) =>
    setAttendance(prev => ({ ...prev, [memberId]: { ...prev[memberId], note } }));

  const markAll = (status) => {
    const next = {};
    members.forEach(m => { next[m.id] = { status, note: attendance[m.id]?.note || '' }; });
    setAttendance(next);
  };

  const handleSave = async () => {
    if (!selectedEvent) return;
    setSaving(true);
    try {
      const list = Object.entries(attendance).map(([memberId, { status, note }]) => ({
        memberId: Number(memberId), status, note: note || null,
      }));
      await bulkMarkAttendance(selectedEvent, list);
      const sRes = await getAttendanceSummary(selectedEvent);
      setSummary(sRes.data);
      toast.success('Attendance saved!');
    } catch {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const filteredMembers = members.filter(m => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return m.fullName.toLowerCase().includes(q) || m.role?.toLowerCase().includes(q);
  });

  const presentCount = Object.values(attendance).filter(a => a.status === 'PRESENT').length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Attendance</h1>
        <p className="text-slate-500 text-sm mt-1">Mark and track member participation per event</p>
      </div>

      {/* Event selector */}
      <div className="card p-5 mb-6">
        <label className="label">Select Event</label>
        <select className="input max-w-lg" value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}>
          <option value="">— Choose an event —</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              [{ev.status}] {ev.title} — {format(new Date(ev.eventDate), 'MMM d, yyyy')}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <>
          {/* Summary cards */}
          {summary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              {[
                { label: 'Present', value: summary.present, color: 'text-emerald-600 bg-emerald-50' },
                { label: 'Absent',  value: summary.absent,  color: 'text-red-600 bg-red-50' },
                { label: 'Excused', value: summary.excused, color: 'text-amber-600 bg-amber-50' },
                { label: 'Rate',    value: `${summary.attendancePercentage}%`, color: 'text-brand-600 bg-brand-50' },
              ].map(({ label, value, color }) => (
                <div key={label} className="card p-4 text-center">
                  <div className={`text-2xl font-display font-extrabold ${color.split(' ')[0]}`}>{value}</div>
                  <div className="text-xs text-slate-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex gap-2">
              <button onClick={() => markAll('PRESENT')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors">
                ✓ All Present
              </button>
              <button onClick={() => markAll('ABSENT')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors">
                ✗ All Absent
              </button>
            </div>
            <div className="relative sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="input pl-9 w-full sm:w-48" placeholder="Filter members…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 whitespace-nowrap">
              {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Save Attendance'}
            </button>
          </div>

          {/* Live count */}
          <div className="flex items-center gap-2 mb-3 text-sm text-slate-500">
            <Users className="w-4 h-4" />
            <span><strong className="text-slate-900">{presentCount}</strong> / {members.length} marked present</span>
          </div>

          {/* Member list */}
          {loading ? (
            <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="card p-4 animate-pulse h-14" />)}</div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Member','Type','Attendance','Note'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredMembers.map(m => {
                    const rec = attendance[m.id] || { status: 'ABSENT', note: '' };
                    return (
                      <tr key={m.id} className={`transition-colors ${rec.status === 'PRESENT' ? 'bg-emerald-50/30' : rec.status === 'EXCUSED' ? 'bg-amber-50/30' : ''}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-xs flex-shrink-0">
                              {m.fullName?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{m.fullName}</p>
                              <p className="text-xs text-slate-400">{m.role || m.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge bg-slate-100 text-slate-500 text-xs">
                            {m.memberType?.replace('_',' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            {['PRESENT','ABSENT','EXCUSED'].map(s => (
                              <button key={s} onClick={() => setStatus(m.id, s)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${rec.status === s ? STATUS_COLORS[s] : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                                {s[0] + s.slice(1).toLowerCase()}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            className="input text-xs py-1.5 w-40"
                            placeholder="Optional note"
                            value={rec.note || ''}
                            onChange={e => setNote(m.id, e.target.value)}
                          />
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
          <CheckSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Select an event above to manage attendance</p>
        </div>
      )}
    </div>
  );
}
