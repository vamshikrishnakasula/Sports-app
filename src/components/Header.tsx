import React from 'react';
import {
  Trophy,
  Search,
  User,
  Radio,
  RefreshCw,
  Flame,
  CircleDot,
  Dribbble,
  Activity,
  Gauge,
  Database,
} from 'lucide-react';
import { SportType } from '../types';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  selectedSport: SportType;
  onSelectSport: (sport: SportType) => void;
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  onSimulateLive: () => void;
  liveMatchCount: number;
  dbStatus: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  selectedSport,
  onSelectSport,
  onOpenSearch,
  onOpenProfile,
  onSimulateLive,
  liveMatchCount,
  dbStatus,
}) => {
  const sportsList: { id: SportType; name: string; icon: React.ReactNode }[] = [
    { id: 'all', name: 'All Sports', icon: <Trophy className="w-4 h-4" /> },
    { id: 'football', name: 'Football', icon: <CircleDot className="w-4 h-4" /> },
    { id: 'cricket', name: 'Cricket', icon: <Flame className="w-4 h-4" /> },
    { id: 'basketball', name: 'Basketball', icon: <Dribbble className="w-4 h-4" /> },
    { id: 'tennis', name: 'Tennis', icon: <Activity className="w-4 h-4" /> },
    { id: 'formula1', name: 'Formula 1', icon: <Gauge className="w-4 h-4" /> },
  ];

  const navTabs = [
    { id: 'home', label: 'Home' },
    { id: 'live', label: 'Live Scores', badge: liveMatchCount > 0 ? `${liveMatchCount}` : undefined },
    { id: 'fixtures', label: 'Fixtures' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'standings', label: 'Points Table' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'teams-players', label: 'Teams & Players' },
    { id: 'updates', label: 'Updates' },
    { id: 'highlights', label: 'Highlights' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
      {/* Top bar: Brand, Search, Live Simulator trigger, DB status & Profile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange('home')}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    SportsZone
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    Pro
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Live Scores, Fixtures & Stats</p>
              </div>
            </button>
          </div>

          {/* Search bar button */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 border border-slate-700/60 hover:border-slate-600 text-sm transition-all"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400" />
                <span>Search player, match, team, updates...</span>
              </span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-700/50 rounded border border-slate-600">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right side controls: DB Status, Live Sim, Mobile Search, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* MongoDB Backend Status */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-medium">
              <Database className="w-3.5 h-3.5" />
              <span>MongoDB</span>
            </div>

            {/* Simulate Live Action trigger */}
            <button
              onClick={onSimulateLive}
              title="Simulate Real-Time Match Tick (Increments live scores & commentary in DB)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 active:scale-95 text-white text-xs font-semibold shadow-md shadow-orange-600/30 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span className="hidden sm:inline">Simulate Live</span>
            </button>

            {/* Search icon for mobile */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Profile modal trigger */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 border border-slate-700/50 text-xs font-medium transition cursor-pointer"
            >
              <User className="w-4 h-4 text-orange-400" />
              <span className="hidden sm:inline">My Profile</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1 border-t border-slate-800/80 py-2">
          {navTabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {tab.id === 'live' && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                {tab.label}
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sport Categories Filter Bar */}
        <div className="flex items-center overflow-x-auto no-scrollbar gap-2 py-2 border-t border-slate-800/50">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
            Sport:
          </span>
          {sportsList.map((sport) => {
            const isSelected = selectedSport === sport.id;
            return (
              <button
                key={sport.id}
                onClick={() => onSelectSport(sport.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-sm font-semibold'
                    : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                }`}
              >
                {sport.icon}
                <span>{sport.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
