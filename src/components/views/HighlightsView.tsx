import React, { useState } from 'react';
import { MatchHighlight, SportType } from '../../types';
import { PlayCircle, Eye, Calendar, Clock, Bookmark, Share2 } from 'lucide-react';

interface HighlightsViewProps {
  highlights: MatchHighlight[];
  selectedSport: SportType;
  bookmarkedHighlightIds: string[];
  onToggleBookmark: (id: string) => void;
  onSelectHighlight: (hl: MatchHighlight) => void;
}

export const HighlightsView: React.FC<HighlightsViewProps> = ({
  highlights,
  selectedSport,
  bookmarkedHighlightIds,
  onToggleBookmark,
  onSelectHighlight,
}) => {
  const filteredHighlights =
    selectedSport === 'all'
      ? highlights
      : highlights.filter((h) => h.sport === selectedSport);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Match Highlights & Replays</h1>
        <p className="text-xs text-slate-400 mt-1">
          High-definition match recaps, turning points, boundary packages, and decisive goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHighlights.map((hl) => {
          const isBookmarked = bookmarkedHighlightIds.includes(hl.id);
          return (
            <div
              key={hl.id}
              className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail & Duration */}
                <div
                  onClick={() => onSelectHighlight(hl)}
                  className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer"
                >
                  <img
                    src={hl.thumbnail}
                    alt={hl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-orange-600/90 group-hover:bg-orange-500 flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-110">
                      <PlayCircle className="w-8 h-8" />
                    </div>
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/85 text-xs font-bold text-white">
                    {hl.duration}
                  </span>
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-600/90 text-white">
                    {hl.sport}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-orange-400 uppercase tracking-wider">
                      {hl.tournament}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(hl.id);
                      }}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark highlight'}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isBookmarked ? 'fill-orange-500 text-orange-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <h3
                    onClick={() => onSelectHighlight(hl)}
                    className="font-bold text-sm text-white group-hover:text-orange-400 cursor-pointer transition-colors leading-snug line-clamp-2"
                  >
                    {hl.title}
                  </h3>

                  {/* Key moments list preview */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
                      Key Moments:
                    </span>
                    {hl.keyMoments.slice(0, 2).map((km, i) => (
                      <p key={i} className="text-xs text-slate-300 flex items-start gap-1.5 line-clamp-1">
                        <span className="text-orange-400 font-bold">•</span>
                        <span>{km}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-3">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {hl.views}
                </span>
                <button
                  onClick={() => onSelectHighlight(hl)}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-200 text-xs font-semibold transition"
                >
                  Watch Recap
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
