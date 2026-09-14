import React, { useState } from 'react';
import { Team, Player, SportType } from '../../types';
import { Shield, Trophy, MapPin, User, Search, Award, ChevronRight } from 'lucide-react';

interface TeamsPlayersViewProps {
  teams: Team[];
  players: Player[];
  selectedSport: SportType;
  onSelectPlayer: (player: Player) => void;
}

export const TeamsPlayersView: React.FC<TeamsPlayersViewProps> = ({
  teams,
  players,
  selectedSport,
  onSelectPlayer,
}) => {
  const [activeTab, setActiveTab] = useState<'teams' | 'players'>('players');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');

  const filteredTeams = teams.filter((t) => {
    if (selectedSport !== 'all' && t.sport !== selectedSport) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.country.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredPlayers = players.filter((p) => {
    if (selectedSport !== 'all' && p.sport !== selectedSport) return false;
    if (selectedTeamId !== 'all' && p.teamId !== selectedTeamId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.nationality.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        p.teamName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Teams & Players Directory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse world-class clubs, squads, player statistics, roles, and profiles.
          </p>
        </div>

        {/* Subtabs: Players vs Teams */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setActiveTab('players')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'players'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Players ({players.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'teams'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Teams ({teams.length})</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeTab === 'players' ? 'player by name, team, position, country...' : 'teams by club or nation...'}`}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
        />
      </div>

      {/* PLAYERS VIEW */}
      {activeTab === 'players' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              onClick={() => onSelectPlayer(player)}
              className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="relative">
                    <img
                      src={player.photo}
                      alt={player.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-orange-500 transition-colors shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-slate-800 text-[10px] font-black text-orange-400 border border-slate-700">
                      #{player.jerseyNumber}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                    {player.sport}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors">
                  {player.name}
                </h3>
                <p className="text-xs text-orange-400 font-semibold">{player.position}</p>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <span>{player.teamName}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Nationality:</span>
                    <span className="font-medium text-slate-200">{player.nationality}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Age:</span>
                    <span className="font-medium text-slate-200">{player.age} yrs</span>
                  </div>
                </div>

                {/* Key Stat Snippet */}
                {Object.keys(player.stats).length > 0 && (
                  <div className="mt-3 p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      {Object.keys(player.stats)[0]}
                    </span>
                    <span className="font-bold text-white">
                      {Object.values(player.stats)[0]}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800 text-xs font-semibold text-orange-400 flex items-center justify-between">
                <span>Full Career Profile</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TEAMS VIEW */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30">
                    {team.sport}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Est. {team.founded}</span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow"
                  />
                  <div>
                    <h3 className="font-bold text-base text-white leading-tight">{team.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{team.country}</p>
                  </div>
                </div>

                <div className="space-y-2 py-3 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> Stadium
                    </span>
                    <span className="font-medium text-slate-200 truncate max-w-[170px]">
                      {team.stadium}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" /> Head Coach / Manager
                    </span>
                    <span className="font-medium text-slate-200">{team.coach}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" /> Major Trophies
                    </span>
                    <span className="font-bold text-amber-400">{team.trophies} Titles</span>
                  </div>
                </div>
              </div>

              {/* Squad Preview */}
              {team.squad && team.squad.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Key Players
                  </span>
                  <div className="flex items-center gap-2">
                    {team.squad.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onSelectPlayer(p)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition cursor-pointer"
                      >
                        <img src={p.photo} alt="" className="w-4 h-4 rounded-full object-cover" />
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
