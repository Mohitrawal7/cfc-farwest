import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-white">CFC FarWest</span>
            </div>
            <p className="text-sm max-w-xs">Code For Change Nepal — FarWest Region. Empowering tech leaders across Sudurpashchim Province.</p>
          </div>
          <div className="flex gap-10">
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-wide mb-3">Navigate</p>
              <div className="space-y-2 text-sm">
                <Link to="/" className="block hover:text-white transition-colors">Home</Link>
                <Link to="/events" className="block hover:text-white transition-colors">Events</Link>
                <Link to="/activities" className="block hover:text-white transition-colors">Activities</Link>
                <Link to="/team" className="block hover:text-white transition-colors">Team</Link>
              </div>
            </div>
            <div>
              <p className="text-white text-xs font-semibold uppercase tracking-wide mb-3">Admin</p>
              <div className="space-y-2 text-sm">
                <Link to="/admin" className="block hover:text-white transition-colors">Dashboard</Link>
                <Link to="/admin/login" className="block hover:text-white transition-colors">Login</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-6 text-xs text-center">
          © {new Date().getFullYear()} Code For Change Nepal — FarWest. Built with ♥ in Nepal.
        </div>
      </div>
    </footer>
  );
}
