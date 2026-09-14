import React from 'react';
import { Player } from '../types';
import { X, Award, Shield, User, MapPin, Calendar, Activity } from 'lucide-react';

interface PlayerDetailModalProps {
  player: Player | null;
  onClose: () => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({ player, onClose }) => {
  if (!player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={player.photo}
                alt={player.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-500 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-xs font-black text-orange-400">
                #{player.jerseyNumber}
              </span>
            </div>

            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {player.sport}
              </span>
              <h3 className="text-xl font-black text-white mt-1">{player.name}</h3>
              <p className="text-xs text-orange-400 font-semibold">{player.position}</p>
              <p className="text-xs text-slate-400 mt-0.5">{player.teamName}</p>
            </div>
          </div>
        </div>

        {/* Bio Details */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block font-medium">Nationality</span>
              <span className="font-bold text-white text-sm mt-0.5 block">
                {player.nationality}
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block font-medium">Age</span>
              <span className="font-bold text-white text-sm mt-0.5 block">{player.age} Years</span>
            </div>
          </div>

          {/* Career Statistics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-orange-400" />
              Official Career Statistics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.entries(player.stats).map(([statName, val]) => (
                <div
                  key={statName}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center"
                >
                  <span className="text-[11px] text-slate-400 font-medium block truncate">
                    {statName}
                  </span>
                  <span className="text-base font-extrabold text-orange-400 mt-0.5 block">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bio Summary */}
          {player.bio && (
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-white block mb-1">Player Biography</span>
              {player.bio}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
