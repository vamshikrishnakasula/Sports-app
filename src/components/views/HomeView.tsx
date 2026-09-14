import React from 'react';
import {
  Match,
  SportsNewsUpdate,
  StandingRow,
  StatLeader,
  MatchHighlight,
  SportType,
} from '../../types';
import {
  PlayCircle,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Flame,
  Radio,
  Eye,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface HomeViewProps {
  matches: Match[];
  updates: SportsNewsUpdate[];
  standings: StandingRow[];
  stats: StatLeader[];
  highlights: MatchHighlight[];
  selectedSport: SportType;
  onSelectMatch: (match: Match) => void;
  onSelectUpdate: (update: SportsNewsUpdate) => void;
  onSelectHighlight: (highlight: MatchHighlight) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  matches,
  updates,
  standings,
  stats,
  highlights,
  selectedSport,
  onSelectMatch,
  onSelectUpdate,
  onSelectHighlight,
  onNavigateTab,
}) => {
  const liveMatches = matches.filter((m) => m.status === 'live');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');
  const heroMatch = liveMatches[0] || matches[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Live Spotlight Banner */}
      {heroMatch && (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700/60 p-6 md:p-8 shadow-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              {heroMatch.status === 'live' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Live Match Center
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/60 text-slate-300 border border-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  Upcoming Match
                </span>
              )}
              <span className="text-xs font-medium text-slate-400">
                {heroMatch.tournamentName}
              </span>
            </div>

            <button
              onClick={() => onSelectMatch(heroMatch)}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition cursor-pointer"
            >
              <span>Match Center</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Teams and Score Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 py-4">
            {/* Home Team */}
            <div className="flex items-center gap-4">
              <img
                src={heroMatch.homeTeam.logo}
                alt={heroMatch.homeTeam.name}
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover border border-slate-700 shadow-md"
              />
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
                  {heroMatch.homeTeam.name}
                </h3>
                <span className="text-xs text-slate-400 font-medium">Home Team</span>
              </div>
            </div>

            {/* Score & Period */}
            <div className="text-center bg-slate-950/60 rounded-xl py-3 px-6 border border-slate-800/80">
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
                <span>{heroMatch.score.homeScore}</span>
                <span className="text-slate-500 text-2xl font-light">-</span>
                <span>{heroMatch.score.awayScore}</span>
              </div>
              <div className="mt-1 flex items-center justify-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold text-orange-400 bg-orange-500/10">
                  {heroMatch.score.periodOrOvers || heroMatch.startTime}
                </span>
              </div>
              {heroMatch.score.summaryNote && (
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  {heroMatch.score.summaryNote}
                </p>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-start md:justify-end gap-4">
              <div className="text-left md:text-right order-2 md:order-1">
                <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
                  {heroMatch.awayTeam.name}
                </h3>
                <span className="text-xs text-slate-400 font-medium">Away Team</span>
              </div>
              <img
                src={heroMatch.awayTeam.logo}
                alt={heroMatch.awayTeam.name}
                className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover border border-slate-700 shadow-md order-1 md:order-2"
              />
            </div>
          </div>

          {/* Quick Striker / Venue Footer */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div>
              <span className="text-slate-400">Venue:</span>{' '}
              <span className="text-slate-200 font-medium">{heroMatch.venue}</span>
            </div>
            {heroMatch.score.currentServerOrStriker && (
              <div className="text-amber-400 font-medium">
                ⚡ {heroMatch.score.currentServerOrStriker}
              </div>
            )}
            <button
              onClick={() => onSelectMatch(heroMatch)}
              className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold transition cursor-pointer"
            >
              Full Scorecard & Commentary
            </button>
          </div>
        </section>
      )}

      {/* Live Scores Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <h2 className="text-xl font-bold text-white">Live Matches</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400">
              {liveMatches.length}
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('live')}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Live</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => onSelectMatch(match)}
              className="group bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-medium text-slate-300 truncate max-w-[180px]">
                  {match.tournamentName}
                </span>
                <span className="flex items-center gap-1 text-red-400 font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  {match.score.periodOrOvers || 'LIVE'}
                </span>
              </div>

              {/* Match Teams & Score */}
              <div className="space-y-2.5 my-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={match.homeTeam.logo}
                      alt={match.homeTeam.name}
                      className="w-6 h-6 rounded-md object-cover"
                    />
                    <span className="font-semibold text-sm text-slate-100 group-hover:text-orange-400 transition-colors">
                      {match.homeTeam.name}
                    </span>
                  </div>
                  <span className="text-base font-bold text-white">
                    {match.score.homeScore}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={match.awayTeam.logo}
                      alt={match.awayTeam.name}
                      className="w-6 h-6 rounded-md object-cover"
                    />
                    <span className="font-semibold text-sm text-slate-100 group-hover:text-orange-400 transition-colors">
                      {match.awayTeam.name}
                    </span>
                  </div>
                  <span className="text-base font-bold text-white">
                    {match.score.awayScore}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span className="truncate max-w-[220px]">
                  {match.score.summaryNote || match.venue}
                </span>
                <span className="text-orange-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                  Scorecard →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two Column Grid: Upcoming Matches & Standings Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Matches (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-bold text-white">Upcoming Fixtures</h2>
            </div>
            <button
              onClick={() => onNavigateTab('fixtures')}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingMatches.slice(0, 4).map((match) => (
              <div
                key={match.id}
                onClick={() => onSelectMatch(match)}
                className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-orange-400 mx-auto mb-0.5" />
                    <span className="text-[11px] font-semibold text-slate-300 block whitespace-nowrap">
                      {match.startTime}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-orange-400/90 block">
                      {match.tournamentName}
                    </span>
                    <h4 className="font-bold text-slate-100 text-sm sm:text-base">
                      {match.homeTeam.name} vs {match.awayTeam.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{match.venue}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                  <span className="text-slate-400 hidden md:inline">
                    {match.score.summaryNote}
                  </span>
                  <button className="px-3 py-1 rounded-md bg-slate-800 text-slate-200 hover:bg-orange-600 hover:text-white font-medium transition text-xs">
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Standings Snapshot (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Points Table</h2>
            </div>
            <button
              onClick={() => onNavigateTab('standings')}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between pb-2 border-b border-slate-800">
              <span>Pos & Team</span>
              <div className="flex items-center gap-4">
                <span>P</span>
                <span>W</span>
                <span className="text-white font-bold">PTS</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {standings.slice(0, 5).map((row) => (
                <div
                  key={`${row.tournamentId}_${row.teamId}`}
                  className="flex items-center justify-between text-xs py-1 hover:bg-slate-800/50 px-2 rounded-md transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 font-bold text-slate-400">{row.position}</span>
                    <img
                      src={row.teamLogo}
                      alt={row.teamName}
                      className="w-5 h-5 rounded-sm object-cover"
                    />
                    <span className="font-semibold text-slate-200 truncate max-w-[120px]">
                      {row.teamName}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-slate-300">
                    <span className="w-3 text-center">{row.played}</span>
                    <span className="w-3 text-center">{row.won}</span>
                    <span className="w-4 text-center font-bold text-orange-400">
                      {row.points}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('standings')}
              className="w-full mt-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
            >
              View All Leagues & Tournaments
            </button>
          </div>
        </div>
      </div>

      {/* Match Highlights Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-white">Match Highlights & Recaps</h2>
          </div>
          <button
            onClick={() => onNavigateTab('highlights')}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
          >
            <span>All Highlights</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.slice(0, 4).map((hl) => (
            <div
              key={hl.id}
              onClick={() => onSelectHighlight(hl)}
              className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden cursor-pointer transition shadow-md flex flex-col"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={hl.thumbnail}
                  alt={hl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-orange-600/90 group-hover:bg-orange-500 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white">
                  {hl.duration}
                </span>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider">
                    {hl.tournament}
                  </span>
                  <h4 className="font-semibold text-xs text-slate-100 group-hover:text-orange-400 line-clamp-2 mt-1 leading-snug">
                    {hl.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {hl.views}
                  </span>
                  <span>{hl.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Sports Updates & Breaking News */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white">Latest Sports Updates</h2>
          </div>
          <button
            onClick={() => onNavigateTab('updates')}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
          >
            <span>All News</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {updates.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectUpdate(item)}
              className="group bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden cursor-pointer transition shadow-md flex flex-col"
            >
              <div className="aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-orange-400 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5">
                    {item.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-2 border-t border-slate-800">
                  <span>{item.readTime}</span>
                  <span className="text-orange-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                    Read Story →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
