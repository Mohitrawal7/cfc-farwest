import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Calendar, ExternalLink, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../services/api';

const EMPTY = {
  title: '', description: '', eventType: 'WORKSHOP', status: 'UPCOMING',
  eventDate: '', eventEndDate: '', venue: '', eventLink: '',
  mentorName: '', mentorDesignation: '', mentorLinkedIn: '',
  bannerImageUrl: '', maxOuterParticipants: '',
};

const TYPE_OPTS = ['WORKSHOP','WEBINAR','HACKATHON','COMPETITION','MENTORSHIP_SESSION'];
const STATUS_OPTS = ['UPCOMING','ONGOING','COMPLETED','CANCELLED'];

const STATUS_BADGE = {
  UPCOMING:  'bg-emerald-50 text-emerald-700',
  ONGOING:   'bg-amber-50 text-amber-700',
  COMPLETED: 'bg-slate-100 text-slate-500',
  CANCELLED: 'bg-red-50 text-red-500',
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => getAllEvents().then(r => setEvents(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (ev) => {
    setEditing(ev);
    setForm({
      ...ev,
      eventDate:    ev.eventDate    ? ev.eventDate.slice(0,16)    : '',
      eventEndDate: ev.eventEndDate ? ev.eventEndDate.slice(0,16) : '',
      maxOuterParticipants: ev.maxOuterParticipants ?? '',
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        maxOuterParticipants: form.maxOuterParticipants !== '' ? Number(form.maxOuterParticipants) : null,
        eventEndDate: form.eventEndDate || null,
      };
      if (editing) {
        await updateEvent(editing.id, payload);
        toast.success('Event updated');
      } else {
        await createEvent(payload);
        toast.success('Event created');
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      toast.success('Event deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Events</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all CFC FarWest events</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="card p-5 animate-pulse h-20" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No events yet. Create your first one!</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Title','Type','Date','Venue','Mentor','Status',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {events.map(ev => (
                <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 max-w-xs">
                    <div className="truncate">{ev.title}</div>
                    {ev.eventLink && (
                      <a href={ev.eventLink} target="_blank" rel="noreferrer"
                        className="text-xs text-brand-500 hover:underline flex items-center gap-0.5 mt-0.5">
                        Link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {ev.eventType?.replace('_SESSION','').replace('_',' ')}
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {format(new Date(ev.eventDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-32 truncate">{ev.venue || '—'}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-32 truncate">{ev.mentorName || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_BADGE[ev.status]}`}>{ev.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(ev)}
                        className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(ev.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="font-display font-bold text-lg text-slate-900">
                {editing ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label">Event Title *</label>
                  <input className="input" required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Web Dev Workshop" />
                </div>

                <div>
                  <label className="label">Event Type *</label>
                  <select className="input" value={form.eventType} onChange={e => set('eventType', e.target.value)}>
                    {TYPE_OPTS.map(t => <option key={t} value={t}>{t.replace('_',' ')}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Status *</label>
                  <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
                    {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Start Date & Time *</label>
                  <input className="input" type="datetime-local" required value={form.eventDate} onChange={e => set('eventDate', e.target.value)} />
                </div>

                <div>
                  <label className="label">End Date & Time</label>
                  <input className="input" type="datetime-local" value={form.eventEndDate} onChange={e => set('eventEndDate', e.target.value)} />
                </div>

                <div>
                  <label className="label">Venue</label>
                  <input className="input" value={form.venue} onChange={e => set('venue', e.target.value)} placeholder="e.g. Zoom / Mahendranagar" />
                </div>

                <div>
                  <label className="label">Event Link</label>
                  <input className="input" type="url" value={form.eventLink} onChange={e => set('eventLink', e.target.value)} placeholder="https://..." />
                </div>

                <div>
                  <label className="label">Mentor Name</label>
                  <input className="input" value={form.mentorName} onChange={e => set('mentorName', e.target.value)} placeholder="Full name" />
                </div>

                <div>
                  <label className="label">Mentor Designation</label>
                  <input className="input" value={form.mentorDesignation} onChange={e => set('mentorDesignation', e.target.value)} placeholder="e.g. SDE @ Google" />
                </div>

                <div>
                  <label className="label">Mentor LinkedIn</label>
                  <input className="input" type="url" value={form.mentorLinkedIn} onChange={e => set('mentorLinkedIn', e.target.value)} placeholder="https://linkedin.com/in/..." />
                </div>

                <div>
                  <label className="label">Max Outer Participants</label>
                  <input className="input" type="number" min="0" value={form.maxOuterParticipants} onChange={e => set('maxOuterParticipants', e.target.value)} placeholder="Leave blank for unlimited" />
                </div>

                <div className="md:col-span-2">
                  <label className="label">Description</label>
                  <textarea className="input resize-none" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description of the event…" />
                </div>

                <div className="md:col-span-2">
                  <label className="label">Banner Image URL</label>
                  <input className="input" type="url" value={form.bannerImageUrl} onChange={e => set('bannerImageUrl', e.target.value)} placeholder="https://..." />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving…' : (editing ? 'Update Event' : 'Create Event')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
