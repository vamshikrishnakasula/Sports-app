import React, { useState } from 'react';
import { MatchHighlight } from '../types';
import { X, Play, Pause, Volume2, Bookmark, Share2, Check, Clock, Eye } from 'lucide-react';

interface HighlightModalProps {
  highlight: MatchHighlight | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const HighlightModal: React.FC<HighlightModalProps> = ({
  highlight,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!highlight) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Top bar */}
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white">
              {highlight.sport}
            </span>
            <span className="text-xs text-slate-300 font-medium">{highlight.tournament}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(highlight.id)}
              className={`p-1.5 rounded-lg border transition ${
                isBookmarked
                  ? 'bg-orange-600/20 border-orange-500 text-orange-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-orange-400' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Share Highlight"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player Stage Mockup */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
          <img
            src={highlight.thumbnail}
            alt={highlight.title}
            className={`w-full h-full object-cover transition-opacity ${
              isPlaying ? 'opacity-90' : 'opacity-60'
            }`}
          />

          {/* Video Overlay HUD */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-4">
            <div className="flex items-center justify-between text-xs text-white">
              <span className="font-semibold bg-black/60 px-2.5 py-1 rounded-md">
                Official Match Recap HD
              </span>
              <span className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-md">
                <Volume2 className="w-3.5 h-3.5" /> High Audio
              </span>
            </div>

            {/* Controls Bar */}
            <div className="space-y-2">
              <div className="w-full h-1.5 bg-slate-700/80 rounded-full overflow-hidden">
                <div className="w-2/5 h-full bg-orange-500 rounded-full animate-pulse"></div>
              </div>

              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span className="text-[11px] text-slate-300">
                    03:45 / {highlight.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{highlight.views}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Details & Timeline */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">{highlight.title}</h3>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
              <span>{highlight.date}</span>
              <span>•</span>
              <span>{highlight.duration} HD Recap</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Key Moments Breakdown
            </h4>
            <div className="space-y-2 text-xs">
              {highlight.keyMoments.map((moment, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
                  <span className="leading-relaxed">{moment}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
