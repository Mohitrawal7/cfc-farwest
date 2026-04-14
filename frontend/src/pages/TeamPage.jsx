import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { getMembers } from '../services/api';

const TYPE_LABELS = { EXECUTIVE: 'Executive Team', COLLEGE_REP: 'College Representatives', GENERAL: 'General Members' };
const TYPE_COLORS = {
  EXECUTIVE:   { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', avatar: 'bg-purple-100 text-purple-700' },
  COLLEGE_REP: { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   avatar: 'bg-blue-100 text-blue-700'   },
  GENERAL:     { bg: 'bg-slate-50',  text: 'text-slate-600',  border: 'border-slate-200',  avatar: 'bg-slate-200 text-slate-600' },
};

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMembers().then(r => setMembers(r.data)).finally(() => setLoading(false));
  }, []);

  const grouped = { EXECUTIVE: [], COLLEGE_REP: [], GENERAL: [] };
  members.forEach(m => { if (grouped[m.memberType]) grouped[m.memberType].push(m); });

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title mb-1">Our Team</h1>
        <p className="text-slate-500">Meet the people driving CFC FarWest forward</p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_,i) => (
            <div key={i} className="card p-5 animate-pulse h-28">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full" />
                <div className="flex-1"><div className="h-4 bg-slate-100 rounded w-3/4 mb-2" /><div className="h-3 bg-slate-100 rounded w-1/2" /></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {['EXECUTIVE','COLLEGE_REP','GENERAL'].map(type => {
            const list = grouped[type];
            if (list.length === 0) return null;
            const c = TYPE_COLORS[type];
            return (
              <div key={type}>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="font-display font-bold text-xl text-slate-800">{TYPE_LABELS[type]}</h2>
                  <span className={`badge ${c.bg} ${c.text} border ${c.border}`}>{list.length}</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {list.map(m => (
                    <div key={m.id} className="card p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${c.avatar}`}>
                          {m.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{m.fullName}</p>
                          {m.role && <p className="text-xs text-slate-500 truncate">{m.role}</p>}
                          {m.college && <p className="text-xs text-slate-400 truncate">{m.college}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
