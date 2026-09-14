import React, { useState } from 'react';
import { SportsNewsUpdate } from '../types';
import { X, Clock, Tag, Share2, Check, User } from 'lucide-react';

interface UpdateDetailModalProps {
  update: SportsNewsUpdate | null;
  onClose: () => void;
}

export const UpdateDetailModal: React.FC<UpdateDetailModalProps> = ({ update, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!update) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
          <img src={update.imageUrl} alt={update.title} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-600 text-white shadow">
              {update.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/70 backdrop-blur text-slate-200">
              {update.sport}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>{update.timestamp}</span>
              <span>•</span>
              <span>{update.readTime}</span>
              {update.author && (
                <>
                  <span>•</span>
                  <span>By {update.author}</span>
                </>
              )}
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-xs">Share</span>
                </>
              )}
            </button>
          </div>

          <h2 className="text-xl font-extrabold text-white leading-snug">{update.title}</h2>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-medium leading-relaxed italic">
            &quot;{update.summary}&quot;
          </div>

          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
            {update.content}
          </div>

          {update.tags && update.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-800 flex items-center gap-2 flex-wrap text-xs">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              {update.tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
