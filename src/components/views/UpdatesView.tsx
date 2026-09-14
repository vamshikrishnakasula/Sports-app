import React, { useState } from 'react';
import { SportsNewsUpdate, SportType } from '../../types';
import { Flame, Clock, Search, Tag, Filter, ChevronRight, Share2 } from 'lucide-react';

interface UpdatesViewProps {
  updates: SportsNewsUpdate[];
  selectedSport: SportType;
  onSelectUpdate: (update: SportsNewsUpdate) => void;
}

export const UpdatesView: React.FC<UpdatesViewProps> = ({
  updates,
  selectedSport,
  onSelectUpdate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'Breaking', 'Injury', 'Transfer', 'Preview', 'Analysis'];

  const filteredUpdates = updates.filter((item) => {
    if (selectedSport !== 'all' && item.sport !== selectedSport) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Sports Updates & News</h1>
          <p className="text-xs text-slate-400 mt-1">
            Verified breaking headlines, transfer movements, injury bulletins, and technical analysis.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Updates' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search updates by keywords, player, or team..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
        />
      </div>

      {/* Updates Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUpdates.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectUpdate(item)}
            className="group bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur text-slate-200">
                    {item.sport}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.timestamp}</span>
                  <span>•</span>
                  <span>{item.readTime}</span>
                </div>

                <h3 className="font-bold text-base text-white group-hover:text-orange-400 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between text-xs border-t border-slate-800/80 mt-2 pt-3">
              <span className="text-orange-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Read Full Story <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
