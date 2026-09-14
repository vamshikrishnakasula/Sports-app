import React, { useState } from 'react';
import { StandingRow, SportType, Tournament } from '../../types';
import { Trophy, TrendingUp, Filter } from 'lucide-react';

interface StandingsViewProps {
  standings: StandingRow[];
  tournaments: Tournament[];
  selectedSport: SportType;
}

export const StandingsView: React.FC<StandingsViewProps> = ({
  standings,
  tournaments,
  selectedSport,
}) => {
  const [activeTournamentId, setActiveTournamentId] = useState<string>('all');

  const filteredStandings = standings.filter((row) => {
    if (activeTournamentId !== 'all' && row.tournamentId !== activeTournamentId) {
      return false;
    }
    if (selectedSport !== 'all' && row.sport !== selectedSport) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Points Table & Standings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Official league tables, team rankings, form guides, and goal difference / net run rate.
          </p>
        </div>

        {/* Tournament Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveTournamentId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeTournamentId === 'all'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Tournaments
          </button>
          {tournaments.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTournamentId(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTournamentId === t.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Standings Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">Pos</th>
                <th className="py-3.5 px-4 min-w-[200px]">Team / Club</th>
                <th className="py-3.5 px-3 text-center">P</th>
                <th className="py-3.5 px-3 text-center">W</th>
                <th className="py-3.5 px-3 text-center">D/T</th>
                <th className="py-3.5 px-3 text-center">L</th>
                <th className="py-3.5 px-3 text-center">GD / NRR</th>
                <th className="py-3.5 px-4 text-center font-bold text-white">PTS</th>
                <th className="py-3.5 px-4 text-center">Recent Form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStandings.map((row) => {
                const isLeader = row.position === 1;
                const isTopFour = row.position <= 4;
                return (
                  <tr
                    key={`${row.tournamentId}_${row.teamId}`}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isLeader ? 'bg-orange-950/10' : ''
                    }`}
                  >
                    {/* Position */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-extrabold ${
                          isLeader
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : isTopFour
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {row.position}
                      </span>
                    </td>

                    {/* Team Name and Logo */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={row.teamLogo}
                          alt={row.teamName}
                          className="w-7 h-7 rounded-lg object-cover border border-slate-700 shadow-sm"
                        />
                        <div>
                          <span className="font-bold text-slate-100 text-sm">{row.teamName}</span>
                          <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                            {row.sport}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Played */}
                    <td className="py-3.5 px-3 text-center font-medium text-slate-300">
                      {row.played}
                    </td>

                    {/* Won */}
                    <td className="py-3.5 px-3 text-center font-semibold text-emerald-400">
                      {row.won}
                    </td>

                    {/* Drawn */}
                    <td className="py-3.5 px-3 text-center font-medium text-slate-400">
                      {row.drawn !== undefined ? row.drawn : '-'}
                    </td>

                    {/* Lost */}
                    <td className="py-3.5 px-3 text-center font-medium text-rose-400">
                      {row.lost}
                    </td>

                    {/* Goal Diff / NRR */}
                    <td className="py-3.5 px-3 text-center font-medium text-slate-300">
                      {row.goalDiffOrNRR}
                    </td>

                    {/* Points */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-slate-800 font-extrabold text-orange-400 text-sm">
                        {row.points}
                      </span>
                    </td>

                    {/* Form Guide */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {row.form.map((res, i) => (
                          <span
                            key={i}
                            className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                              res === 'W'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : res === 'L'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                            }`}
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500"></span>
            <span>League Leader</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500/30 border border-blue-500"></span>
            <span>Championship Qualification</span>
          </span>
        </div>
        <div>
          <span>P = Played, W = Won, D/T = Drawn/Tied, L = Lost, PTS = Total Points</span>
        </div>
      </div>
    </div>
  );
};
