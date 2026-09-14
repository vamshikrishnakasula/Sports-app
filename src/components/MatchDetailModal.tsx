import React from 'react';
import { Match } from '../types';
import { X, MapPin, Clock, Trophy, Flame, Bookmark, Share2, Radio } from 'lucide-react';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (matchId: string) => void;
  onSimulateLive?: (matchId: string) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onSimulateLive,
}) => {
  if (!match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30">
              {match.sport}
            </span>
            <span className="text-xs text-slate-400 font-medium">{match.tournamentName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(match.id)}
              className={`p-2 rounded-lg border transition ${
                isBookmarked
                  ? 'bg-orange-600/20 border-orange-500 text-orange-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark this match'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-orange-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Big Scorecard Banner */}
        <div className="p-6 md:p-8 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>{match.startTime}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {match.venue}
              </span>
            </div>

            {match.status === 'live' && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                {match.score.periodOrOvers}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 items-center gap-4 py-4">
            {/* Home Team */}
            <div className="text-center sm:text-left flex flex-col sm:flex-row items-center gap-3">
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow"
              />
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {match.homeTeam.name}
                </h3>
                <span className="text-xs font-semibold text-orange-400">
                  {match.score.details?.homeInnings || ''}
                </span>
              </div>
            </div>

            {/* Score Center */}
            <div className="text-center bg-slate-950/80 rounded-xl p-4 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-black text-white">
                {match.score.homeScore} : {match.score.awayScore}
              </div>
              <div className="text-xs font-bold text-orange-400 mt-1">
                {match.score.periodOrOvers || match.status.toUpperCase()}
              </div>
            </div>

            {/* Away Team */}
            <div className="text-center sm:text-right flex flex-col sm:flex-row-reverse items-center gap-3">
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow"
              />
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {match.awayTeam.name}
                </h3>
                <span className="text-xs font-semibold text-orange-400">
                  {match.score.details?.awayInnings || ''}
                </span>
              </div>
            </div>
          </div>

          {match.score.summaryNote && (
            <div className="mt-4 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-center text-xs text-slate-300 font-medium">
              {match.score.summaryNote}
            </div>
          )}

          {match.score.currentServerOrStriker && (
            <div className="mt-3 p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-300 flex items-center justify-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{match.score.currentServerOrStriker}</span>
            </div>
          )}
        </div>

        {/* Timeline & Commentary */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          <h4 className="font-bold text-sm text-white">Match Timeline & Commentary</h4>
          {match.events && match.events.length > 0 ? (
            <div className="space-y-3">
              {match.events.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 text-xs p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="px-2 py-0.5 rounded bg-slate-800 font-bold text-orange-400">
                    {ev.time}
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-slate-200">{ev.player || 'Play'}</span>
                    <p className="text-slate-400 mt-0.5">{ev.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">
              Match schedule confirmed. Commentary activates at kickoff.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Venue: {match.venue}</span>
          {match.status === 'live' && onSimulateLive && (
            <button
              onClick={() => onSimulateLive(match.id)}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition"
            >
              Simulate Live Ball
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
