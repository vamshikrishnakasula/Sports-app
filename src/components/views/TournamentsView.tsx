import React from 'react';
import { Tournament, SportType } from '../../types';
import { Trophy, Calendar, Users, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';

interface TournamentsViewProps {
  tournaments: Tournament[];
  selectedSport: SportType;
  onSelectTournament: (tournament: Tournament) => void;
}

export const TournamentsView: React.FC<TournamentsViewProps> = ({
  tournaments,
  selectedSport,
  onSelectTournament,
}) => {
  const filteredTournaments =
    selectedSport === 'all'
      ? tournaments
      : tournaments.filter((t) => t.sport === selectedSport);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Major Tournaments & Leagues</h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore world-class tournaments, seasons, participating clubs, and championship leaders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTournaments.map((tour) => (
          <div
            key={tour.id}
            onClick={() => onSelectTournament(tour)}
            className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30">
                  {tour.sport}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300">
                  {tour.season}
                </span>
              </div>

              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={tour.logo}
                  alt={tour.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow"
                />
                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-orange-400 transition-colors leading-snug">
                    {tour.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{tour.countryOrRegion}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 py-3 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" /> Teams
                  </span>
                  <span className="font-semibold text-white">{tour.teamsCount} Teams</span>
                </div>

                {tour.currentLeader && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" /> Current Leader
                    </span>
                    <span className="font-bold text-amber-400">{tour.currentLeader}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> Duration
                  </span>
                  <span className="font-medium text-slate-300">
                    {tour.startDate} to {tour.endDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {tour.status}
              </span>
              <span className="text-orange-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                Standings & Fixtures <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
