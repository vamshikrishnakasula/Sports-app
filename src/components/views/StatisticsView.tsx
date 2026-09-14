import React, { useState } from 'react';
import { StatLeader, SportType } from '../../types';
import { Award, Flame, TrendingUp, Filter, Users } from 'lucide-react';

interface StatisticsViewProps {
  stats: StatLeader[];
  selectedSport: SportType;
  onSelectPlayerName?: (name: string) => void;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  stats,
  selectedSport,
  onSelectPlayerName,
}) => {
  const categories = Array.from(new Set(stats.map((s) => s.category)));
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredStats = stats.filter((s) => {
    if (activeCategory !== 'all' && s.category !== activeCategory) return false;
    if (selectedSport !== 'all' && s.sport !== selectedSport) return false;
    return true;
  });

  // Group by category for high-impact display if "all" is selected
  const groupedCategories = Array.from(new Set(filteredStats.map((s) => s.category)));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Player Statistics & Leaders</h1>
          <p className="text-xs text-slate-400 mt-1">
            Top performers across goals, runs, wickets, assists, points per game, and tournament awards.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groupedCategories.map((catName) => {
          const catLeaders = filteredStats.filter((s) => s.category === catName);
          const topLeader = catLeaders.find((s) => s.rank === 1) || catLeaders[0];

          return (
            <div
              key={catName}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col"
            >
              {/* Category Header */}
              <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">{catName}</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {topLeader?.sport}
                </span>
              </div>

              {/* Number 1 Spotlight */}
              {topLeader && (
                <div className="p-5 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={topLeader.playerPhoto}
                        alt={topLeader.playerName}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
                      />
                      <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-amber-500 text-black font-black text-xs flex items-center justify-center shadow">
                        #1
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-white">{topLeader.playerName}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <img
                          src={topLeader.teamLogo}
                          alt=""
                          className="w-3.5 h-3.5 rounded-sm object-cover"
                        />
                        {topLeader.teamName}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {topLeader.matchesPlayed} Matches Played
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-amber-400 uppercase font-bold tracking-wider block">
                      Leader
                    </span>
                    <span className="text-2xl font-black text-white">{topLeader.value}</span>
                  </div>
                </div>
              )}

              {/* Other Ranks List */}
              <div className="divide-y divide-slate-800/60 flex-1">
                {catLeaders.slice(1).map((item) => (
                  <div
                    key={item.playerId}
                    className="p-3.5 px-5 flex items-center justify-between hover:bg-slate-800/30 transition text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 font-bold text-slate-400 text-center">#{item.rank}</span>
                      <img
                        src={item.playerPhoto}
                        alt={item.playerName}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                      />
                      <div>
                        <span className="font-bold text-slate-200 block">{item.playerName}</span>
                        <span className="text-[11px] text-slate-400">{item.teamName}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-orange-400 text-sm block">
                        {item.value}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.matchesPlayed} matches</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
