import React, { useState, useEffect } from 'react';
import { SearchResults, Player, Match, Team, SportsNewsUpdate } from '../types';
import { api } from '../services/api';
import { Search, X, User, Trophy, Calendar, Flame, ChevronRight, Loader2 } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
  onSelectMatch: (match: Match) => void;
  onSelectUpdate: (update: SportsNewsUpdate) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPlayer,
  onSelectMatch,
  onSelectUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResults>({
    players: [],
    matches: [],
    teams: [],
    updates: [],
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'players' | 'matches' | 'updates'>('all');

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults({ players: [], matches: [], teams: [], updates: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.searchAll(searchTerm);
        setResults(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isOpen) return null;

  const totalResults =
    results.players.length + results.matches.length + results.teams.length + results.updates.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden mb-12">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <Search className="w-5 h-5 text-orange-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search players (Kohli, Haaland, Mbappé), matches, teams, or news..."
            className="w-full bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-orange-400 animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              activeTab === 'all'
                ? 'bg-orange-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            All Results
          </button>
          <button
            onClick={() => setActiveTab('players')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              activeTab === 'players'
                ? 'bg-orange-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            Players ({results.players.length})
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              activeTab === 'matches'
                ? 'bg-orange-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            Matches ({results.matches.length})
          </button>
          <button
            onClick={() => setActiveTab('updates')}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              activeTab === 'updates'
                ? 'bg-orange-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            Updates ({results.updates.length})
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-[65vh] overflow-y-auto space-y-4">
          {!searchTerm.trim() ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p>Type to search across players, matches, teams, and news updates.</p>
              <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400">Try searching:</span>
                <button
                  onClick={() => setSearchTerm('Virat Kohli')}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px]"
                >
                  Virat Kohli
                </button>
                <button
                  onClick={() => setSearchTerm('Real Madrid')}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px]"
                >
                  Real Madrid
                </button>
                <button
                  onClick={() => setSearchTerm('Champions League')}
                  className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px]"
                >
                  Champions League
                </button>
              </div>
            </div>
          ) : totalResults === 0 && !loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No results found for &quot;{searchTerm}&quot;. Try different keywords.
            </div>
          ) : (
            <>
              {/* Players */}
              {(activeTab === 'all' || activeTab === 'players') && results.players.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-400" />
                    Players
                  </h4>
                  <div className="space-y-1.5">
                    {results.players.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectPlayer(p);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 cursor-pointer transition text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.photo}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                          />
                          <div>
                            <span className="font-bold text-white block">{p.name}</span>
                            <span className="text-[11px] text-slate-400">
                              {p.teamName} • #{p.jerseyNumber} {p.position}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-300">
                          {p.sport}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matches */}
              {(activeTab === 'all' || activeTab === 'matches') && results.matches.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-orange-400" />
                    Matches
                  </h4>
                  <div className="space-y-1.5">
                    {results.matches.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          onSelectMatch(m);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 cursor-pointer transition text-xs"
                      >
                        <div>
                          <span className="text-[10px] font-semibold text-orange-400 uppercase">
                            {m.tournamentName}
                          </span>
                          <span className="font-bold text-white block">
                            {m.homeTeam.name} vs {m.awayTeam.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {m.score.periodOrOvers || m.startTime} • {m.venue}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-white text-sm">
                            {m.score.homeScore} - {m.score.awayScore}
                          </span>
                          <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                            {m.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Updates / News */}
              {(activeTab === 'all' || activeTab === 'updates') && results.updates.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    Sports Updates
                  </h4>
                  <div className="space-y-1.5">
                    {results.updates.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          onSelectUpdate(u);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 cursor-pointer transition text-xs"
                      >
                        <div className="flex-1 pr-3">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-orange-500/20 text-orange-400 uppercase mr-2">
                            {u.category}
                          </span>
                          <span className="font-bold text-white leading-snug">{u.title}</span>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {u.summary}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
