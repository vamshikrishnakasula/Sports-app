import React, { useState } from 'react';
import { Match, SportType, MatchStatus } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Filter,
  CheckCircle,
  Radio,
  Search,
  ChevronRight,
} from 'lucide-react';

interface FixturesViewProps {
  matches: Match[];
  selectedSport: SportType;
  onSelectMatch: (match: Match) => void;
}

export const FixturesView: React.FC<FixturesViewProps> = ({
  matches,
  selectedSport,
  onSelectMatch,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | MatchStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  let filteredMatches = matches;

  if (selectedSport !== 'all') {
    filteredMatches = filteredMatches.filter((m) => m.sport === selectedSport);
  }

  if (statusFilter !== 'all') {
    filteredMatches = filteredMatches.filter((m) => m.status === statusFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredMatches = filteredMatches.filter(
      (m) =>
        m.homeTeam.name.toLowerCase().includes(q) ||
        m.awayTeam.name.toLowerCase().includes(q) ||
        m.tournamentName.toLowerCase().includes(q) ||
        m.venue.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Fixtures & Schedule</h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete schedule of upcoming clashes, live encounters, and full-time results.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({matches.length})
          </button>
          <button
            onClick={() => setStatusFilter('live')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'live'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            Live
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              statusFilter === 'upcoming'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Finished
          </button>
        </div>
      </div>

      {/* Search and Quick Filters */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter fixtures by team, tournament or venue..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
        />
      </div>

      {/* Match Cards List */}
      <div className="space-y-3">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => onSelectMatch(match)}
              className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition shadow-sm cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Tournament & Timing Left Col */}
              <div className="md:w-1/4">
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block truncate">
                  {match.tournamentName}
                </span>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">{match.startTime}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 truncate">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{match.venue}</span>
                </div>
              </div>

              {/* Match Teams & Center Score */}
              <div className="flex-1 flex items-center justify-between md:justify-center gap-4 sm:gap-8">
                {/* Home Team */}
                <div className="flex items-center gap-3 text-right flex-1 justify-end">
                  <span className="font-bold text-sm text-slate-100 group-hover:text-orange-400 transition-colors">
                    {match.homeTeam.name}
                  </span>
                  <img
                    src={match.homeTeam.logo}
                    alt={match.homeTeam.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-800"
                  />
                </div>

                {/* Score or VS Pill */}
                <div className="text-center px-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 min-w-[90px]">
                  {match.status === 'upcoming' ? (
                    <span className="text-xs font-bold text-slate-400">VS</span>
                  ) : (
                    <div className="text-sm font-extrabold text-white">
                      {match.score.homeScore} - {match.score.awayScore}
                    </div>
                  )}
                  <span
                    className={`text-[9px] font-bold block mt-0.5 ${
                      match.status === 'live'
                        ? 'text-red-400 uppercase animate-pulse'
                        : match.status === 'completed'
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {match.score.periodOrOvers || match.status.toUpperCase()}
                  </span>
                </div>

                {/* Away Team */}
                <div className="flex items-center gap-3 text-left flex-1 justify-start">
                  <img
                    src={match.awayTeam.logo}
                    alt={match.awayTeam.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-800"
                  />
                  <span className="font-bold text-sm text-slate-100 group-hover:text-orange-400 transition-colors">
                    {match.awayTeam.name}
                  </span>
                </div>
              </div>

              {/* Status & CTA Button */}
              <div className="md:w-1/4 flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <span className="text-[11px] text-slate-400 truncate max-w-[140px] hidden lg:inline">
                  {match.score.summaryNote}
                </span>
                <button className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-200 text-xs font-semibold transition flex items-center gap-1">
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No fixtures match your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the status or sport filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
