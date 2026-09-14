import React from 'react';
import { Match } from '../types';
import { Radio, ChevronRight } from 'lucide-react';

interface LiveTickerProps {
  liveMatches: Match[];
  onSelectMatch: (match: Match) => void;
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ liveMatches, onSelectMatch }) => {
  if (!liveMatches || liveMatches.length === 0) return null;

  return (
    <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span>Live Scores</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
          {liveMatches.map((match) => (
            <button
              key={match.id}
              onClick={() => onSelectMatch(match)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition shrink-0 cursor-pointer text-xs"
            >
              <span className="font-semibold text-slate-300">{match.homeTeam.shortName}</span>
              <span className="font-bold text-white px-1.5 py-0.5 bg-slate-800 rounded">
                {match.score.homeScore} - {match.score.awayScore}
              </span>
              <span className="font-semibold text-slate-300">{match.awayTeam.shortName}</span>
              <span className="text-[11px] font-medium text-orange-400 ml-1">
                {match.score.periodOrOvers}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
