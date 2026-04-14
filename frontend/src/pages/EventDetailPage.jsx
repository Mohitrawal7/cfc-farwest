import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, User, ExternalLink, ArrowLeft, Clock, Linkedin } from 'lucide-react';
import { format } from 'date-fns';
import { getEventById } from '../services/api';

const TYPE_COLORS = {
  WORKSHOP: 'bg-purple-50 text-purple-700 border-purple-200',
  WEBINAR: 'bg-blue-50 text-blue-700 border-blue-200',
  HACKATHON: 'bg-orange-50 text-orange-700 border-orange-200',
  COMPETITION: 'bg-red-50 text-red-700 border-red-200',
  MENTORSHIP_SESSION: 'bg-green-50 text-green-700 border-green-200',
};

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventById(id)
      .then(r => setEvent(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page-container animate-pulse">
      <div className="h-8 bg-slate-100 rounded w-1/3 mb-4" />
      <div className="h-64 bg-slate-100 rounded-2xl mb-6" />
    </div>
  );

  if (!event) return (
    <div className="page-container text-center py-20 text-slate-400">
      Event not found.
    </div>
  );

  const dateObj = new Date(event.eventDate);
  const endDate = event.eventEndDate ? new Date(event.eventEndDate) : null;

  return (
    <div className="page-container max-w-4xl">
      <Link to="/events" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </Link>

      <div className="card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-800 to-brand-600 text-white p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`badge border ${TYPE_COLORS[event.eventType]} bg-white/20 border-white/30 text-white`}>
              {event.eventType?.replace('_', ' ')}
            </span>
            <span className="badge bg-white/20 text-white">{event.status}</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold mb-3">{event.title}</h1>
          <p className="text-brand-200 text-base leading-relaxed max-w-2xl">{event.description}</p>
        </div>

        {/* Details grid */}
        <div className="p-8 grid md:grid-cols-2 gap-8">
          {/* Event Info */}
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Event Details</h2>
            <div className="space-y-4">
              <InfoRow icon={Calendar} label="Date">
                {format(dateObj, 'EEEE, MMMM d, yyyy')}
              </InfoRow>
              <InfoRow icon={Clock} label="Time">
                {format(dateObj, 'h:mm a')}
                {endDate && <> – {format(endDate, 'h:mm a')}</>}
              </InfoRow>
              {event.venue && (
                <InfoRow icon={MapPin} label="Venue">
                  {event.venue}
                </InfoRow>
              )}
              {event.eventLink && (
                <InfoRow icon={ExternalLink} label="Link">
                  <a
                    href={event.eventLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-600 hover:underline break-all"
                  >
                    {event.eventLink}
                  </a>
                </InfoRow>
              )}
              {event.maxOuterParticipants && (
                <InfoRow icon={User} label="Outer Slots">
                  {event.maxOuterParticipants} seats available for outside students
                </InfoRow>
              )}
            </div>
          </div>

          {/* Mentor Info */}
          {event.mentorName && (
            <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">Mentor / Speaker</h2>
              <div className="bg-slate-50 rounded-xl p-5 flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 font-display text-lg">{event.mentorName}</p>
                  {event.mentorDesignation && (
                    <p className="text-sm text-slate-500 mt-0.5">{event.mentorDesignation}</p>
                  )}
                  {event.mentorLinkedIn && (
                    <a
                      href={event.mentorLinkedIn}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:underline mt-2 font-medium"
                    >
                      <Linkedin className="w-3.5 h-3.5" /> View LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA for upcoming events */}
        {event.status === 'UPCOMING' && event.eventLink && (
          <div className="border-t border-slate-100 p-6 bg-brand-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-brand-800 font-medium">
                🎯 This event is open! Members register first, then outside students can join.
              </p>
              <a
                href={event.eventLink}
                target="_blank"
                rel="noreferrer"
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                Register Now <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-brand-600" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-slate-700 mt-0.5">{children}</p>
      </div>
    </div>
  );
}
