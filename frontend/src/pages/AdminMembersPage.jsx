import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Users, X, Save, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllMembers, createMember, updateMember, deleteMember } from '../services/api';

const EMPTY = { fullName: '', email: '', phone: '', memberType: 'GENERAL', role: '', college: '', profileImageUrl: '', active: true };

const TYPE_COLORS = {
  EXECUTIVE:   'bg-purple-50 text-purple-700',
  COLLEGE_REP: 'bg-blue-50 text-blue-700',
  GENERAL:     'bg-slate-100 text-slate-600',
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const load = () => getAllMembers().then(r => setMembers(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  useEffect(() => {
    let result = members;
    if (typeFilter !== 'ALL') result = result.filter(m => m.memberType === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(m => m.fullName.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.role?.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [members, typeFilter, search]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (m) => { setEditing(m); setForm({ ...m }); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateMember(editing.id, form);
        toast.success('Member updated');
      } else {
        await createMember(form);
        toast.success('Member added');
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await deleteMember(id);
      toast.success('Member removed');
      load();
    } catch { toast.error('Failed to delete'); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const counts = {
    ALL: members.length,
    EXECUTIVE: members.filter(m => m.memberType === 'EXECUTIVE').length,
    COLLEGE_REP: members.filter(m => m.memberType === 'COLLEGE_REP').length,
    GENERAL: members.filter(m => m.memberType === 'GENERAL').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Members</h1>
          <p className="text-slate-500 text-sm mt-1">{members.length} total members in CFC FarWest</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2 flex-wrap">
          {['ALL','EXECUTIVE','COLLEGE_REP','GENERAL'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${typeFilter === t ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-brand-300'}`}>
              {t === 'ALL' ? 'All' : t.replace('_',' ')} ({counts[t]})
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input className="input pl-9 w-full sm:w-56" placeholder="Search members…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card p-4 animate-pulse h-16" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No members found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Member','Role / College','Type','Contact','Status',''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-xs flex-shrink-0">
                        {m.fullName?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{m.fullName}</p>
                        <p className="text-xs text-slate-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    <div>{m.role || '—'}</div>
                    {m.college && <div className="text-xs text-slate-400">{m.college}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${TYPE_COLORS[m.memberType]}`}>
                      {m.memberType?.replace('_',' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{m.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${m.active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                      {m.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-up">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="font-display font-bold text-lg text-slate-900">
                {editing ? 'Edit Member' : 'Add Member'}
              </h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <input className="input" required value={form.fullName} onChange={e => set('fullName', e.target.value)} />
              </div>
              <div>
                <label className="label">Email *</label>
                <input className="input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone</label>
                  <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+977..." />
                </div>
                <div>
                  <label className="label">Member Type *</label>
                  <select className="input" value={form.memberType} onChange={e => set('memberType', e.target.value)}>
                    <option value="EXECUTIVE">Executive</option>
                    <option value="COLLEGE_REP">College Rep</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Role / Position</label>
                <input className="input" value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. President, Tech Lead" />
              </div>
              {form.memberType === 'COLLEGE_REP' && (
                <div>
                  <label className="label">College</label>
                  <input className="input" value={form.college} onChange={e => set('college', e.target.value)} placeholder="College name" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <input type="checkbox" id="active" checked={form.active} onChange={e => set('active', e.target.checked)} className="w-4 h-4 rounded accent-brand-600" />
                <label htmlFor="active" className="text-sm text-slate-700 font-medium">Active Member</label>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving…' : (editing ? 'Update' : 'Add Member')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
