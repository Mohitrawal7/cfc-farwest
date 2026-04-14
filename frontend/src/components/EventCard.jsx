import { Link } from 'react-router-dom';
import { Calendar, MapPin, User, ExternalLink, Clock } from 'lucide-react';
import { format, isPast } from 'date-fns';

const TYPE_COLORS = {
  WORKSHOP:          'bg-purple-50 text-purple-700 border-purple-200',
  WEBINAR:           'bg-blue-50 text-blue-700 border-blue-200',
  HACKATHON:         'bg-orange-50 text-orange-700 border-orange-200',
  COMPETITION:       'bg-red-50 text-red-700 border-red-200',
  MENTORSHIP_SESSION:'bg-green-50 text-green-700 border-green-200',
};

const STATUS_COLORS = {
  UPCOMING:  'bg-emerald-50 text-emerald-700',
  ONGOING:   'bg-amber-50 text-amber-700',
  COMPLETED: 'bg-slate-100 text-slate-500',
  CANCELLED: 'bg-red-50 text-red-500',
};

const TYPE_LABELS = {
  WORKSHOP: 'Workshop',
  WEBINAR: 'Webinar',
  HACKATHON: 'Hackathon',
  COMPETITION: 'Competition',
  MENTORSHIP_SESSION: 'Mentorship',
};

export default function EventCard({ event, className = '' }) {
  const dateObj = new Date(event.eventDate);

  return (
    <Link
      to={`/events/${event.id}`}
      className={`card p-5 flex flex-col gap-3 group cursor-pointer ${className}`}
    >
      {/* Top row: type + status */}
      <div className="flex items-center justify-between gap-2">
        <span className={`badge border ${TYPE_COLORS[event.eventType] || 'bg-slate-50 text-slate-600'}`}>
          {TYPE_LABELS[event.eventType] || event.eventType}
        </span>
        <span className={`badge ${STATUS_COLORS[event.status] || ''}`}>
          {event.status}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display font-bold text-slate-900 text-lg leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
        {event.title}
      </h3>

      {/* Description */}
      {event.description && (
        <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>
      )}

      {/* Meta */}
      <div className="flex flex-col gap-1.5 text-xs text-slate-500 mt-auto pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
          <span>{format(dateObj, 'EEE, MMM d yyyy')} · {format(dateObj, 'h:mm a')}</span>
        </div>
        {event.venue && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        )}
        {event.mentorName && (
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
            <span className="truncate">{event.mentorName}
              {event.mentorDesignation && <> · <em className="not-italic text-slate-400">{event.mentorDesignation}</em></>}
            </span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-2 transition-all">
        View Details <ExternalLink className="w-3 h-3" />
      </div>
    </Link>
  );
}
