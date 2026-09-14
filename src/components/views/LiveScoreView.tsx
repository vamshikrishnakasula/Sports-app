import React, { useState } from 'react';
import { Match, SportType } from '../../types';
import {
  Radio,
  RefreshCw,
  Clock,
  MapPin,
  Flame,
  Award,
  CircleDot,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface LiveScoreViewProps {
  matches: Match[];
  selectedSport: SportType;
  onSimulateLiveAction: (matchId: string) => Promise<void>;
  onSelectMatch: (match: Match) => void;
}

export const LiveScoreView: React.FC<LiveScoreViewProps> = ({
  matches,
  selectedSport,
  onSimulateLiveAction,
  onSelectMatch,
}) => {
  const [selectedMatchId, setSelectedMatchId] = useState<string>(
    matches.find((m) => m.status === 'live')?.id || matches[0]?.id || ''
  );
  const [isSimulating, setIsSimulating] = useState(false);

  const liveMatches = matches.filter((m) => m.status === 'live');
  const activeMatch = matches.find((m) => m.id === selectedMatchId) || liveMatches[0] || matches[0];

  const handleSimulate = async () => {
    if (!activeMatch || activeMatch.status !== 'live') return;
    setIsSimulating(true);
    try {
      await onSimulateLiveAction(activeMatch.id);
    } finally {
      setIsSimulating(false);
    }
  };

  if (!activeMatch) {
    return (
      <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800">
        <Radio className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Live Matches Right Now</h3>
        <p className="text-sm text-slate-400 mt-1">Check back soon or explore upcoming fixtures.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Live Match Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time scorecards, ball-by-ball updates, live commentary, and event timeline.
          </p>
        </div>

        {/* Live Simulator Button */}
        {activeMatch.status === 'live' && (
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 active:scale-95 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating Play...' : 'Simulate Live Action (Next Ball / Play)'}</span>
          </button>
        )}
      </div>

      {/* Match Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
        {matches.map((m) => {
          const isSelected = m.id === activeMatch.id;
          const isLive = m.status === 'live';
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMatchId(m.id)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-left transition shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 border-orange-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-300">
                    {m.homeTeam.shortName} vs {m.awayTeam.shortName}
                  </span>
                  {isLive && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-500 text-white animate-pulse">
                      LIVE
                    </span>
                  )}
                </div>
                <div className="text-xs font-extrabold text-white mt-0.5">
                  {m.score.homeScore} - {m.score.awayScore}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Scoreboard Display */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-bold text-orange-400 uppercase tracking-wider">
              {activeMatch.tournamentName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {activeMatch.venue}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40">
              {activeMatch.score.periodOrOvers || 'LIVE'}
            </span>
          </div>
        </div>

        {/* Big Teams & Score Center */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 py-8">
          {/* Home Team */}
          <div className="flex items-center gap-4">
            <img
              src={activeMatch.homeTeam.logo}
              alt={activeMatch.homeTeam.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border border-slate-700 shadow-lg"
            />
            <div>
              <span className="text-xs font-semibold text-slate-400">Home</span>
              <h2 className="text-xl md:text-2xl font-black text-white">{activeMatch.homeTeam.name}</h2>
              <span className="text-sm font-semibold text-orange-400">
                {activeMatch.score.details?.homeInnings || ''}
              </span>
            </div>
          </div>

          {/* Center Score */}
          <div className="text-center bg-slate-950/80 rounded-2xl p-6 border border-slate-800">
            <div className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-4">
              <span>{activeMatch.score.homeScore}</span>
              <span className="text-slate-600 font-light">:</span>
              <span>{activeMatch.score.awayScore}</span>
            </div>
            <div className="mt-2 text-xs font-bold text-orange-400 tracking-wide">
              {activeMatch.score.periodOrOvers}
            </div>
            {activeMatch.score.summaryNote && (
              <p className="mt-3 text-xs text-slate-300 font-medium bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-800">
                {activeMatch.score.summaryNote}
              </p>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-start md:justify-end gap-4">
            <div className="text-left md:text-right order-2 md:order-1">
              <span className="text-xs font-semibold text-slate-400">Away</span>
              <h2 className="text-xl md:text-2xl font-black text-white">{activeMatch.awayTeam.name}</h2>
              <span className="text-sm font-semibold text-orange-400">
                {activeMatch.score.details?.awayInnings || ''}
              </span>
            </div>
            <img
              src={activeMatch.awayTeam.logo}
              alt={activeMatch.awayTeam.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border border-slate-700 shadow-lg order-1 md:order-2"
            />
          </div>
        </div>

        {/* Current Striker / Pitch Status */}
        {activeMatch.score.currentServerOrStriker && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3 text-xs">
            <Flame className="w-4 h-4 text-orange-400 shrink-0" />
            <div>
              <span className="font-bold text-slate-200">On Strike / Action: </span>
              <span className="text-amber-400 font-semibold">{activeMatch.score.currentServerOrStriker}</span>
            </div>
          </div>
        )}
      </div>

      {/* Timeline & Live Commentary Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Commentary & Timeline (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Live Commentary & Key Events</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">Auto-refreshed</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            {activeMatch.events && activeMatch.events.length > 0 ? (
              activeMatch.events.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 pb-4 border-b border-slate-800 last:border-0 last:pb-0"
                >
                  <div className="px-2.5 py-1 rounded-md bg-slate-800 font-bold text-xs text-orange-400 shrink-0">
                    {event.time}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{event.player || 'Play Update'}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          event.type === 'goal' || event.type === 'boundary'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : event.type === 'wicket' || event.type === 'card'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {event.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No key events recorded yet for this match.
              </div>
            )}
          </div>
        </div>

        {/* Match Info & Breakdown (1 col) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Match Overview</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Competition</span>
              <span className="font-bold text-slate-200 text-sm">{activeMatch.tournamentName}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Stadium & City</span>
              <span className="font-semibold text-slate-200">{activeMatch.venue}</span>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Sport Category</span>
              <span className="font-semibold uppercase tracking-wider text-orange-400">
                {activeMatch.sport}
              </span>
            </div>

            {activeMatch.score.details?.homeBreakdown && (
              <div className="pt-3 border-t border-slate-800">
                <span className="text-slate-400 block font-medium mb-2">Quarter / Set Breakdown</span>
                <div className="grid grid-cols-5 gap-2 text-center">
                  <span className="text-slate-400 font-semibold">Team</span>
                  <span className="text-slate-400">1</span>
                  <span className="text-slate-400">2</span>
                  <span className="text-slate-400">3</span>
                  <span className="text-slate-400">4</span>

                  <span className="font-bold text-slate-200 text-left truncate">
                    {activeMatch.homeTeam.shortName}
                  </span>
                  {activeMatch.score.details.homeBreakdown.map((val, i) => (
                    <span key={i} className="font-semibold text-white">
                      {val}
                    </span>
                  ))}

                  <span className="font-bold text-slate-200 text-left truncate">
                    {activeMatch.awayTeam.shortName}
                  </span>
                  {activeMatch.score.details.awayBreakdown?.map((val, i) => (
                    <span key={i} className="font-semibold text-white">
                      {val}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => onSelectMatch(activeMatch)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-semibold transition"
              >
                Open Complete Lineup & Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
