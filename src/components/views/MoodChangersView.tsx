import React, { useState, useEffect } from 'react';
import {
  Film,
  BookOpen,
  Activity,
  Sparkles,
  Bot,
  Heart,
  Loader2,
  Clock,
  Tag,
  Bookmark,
  Check,
  Filter,
} from 'lucide-react';
import { MoodChangerItem, MoodChangerCategory, MoodType } from '../../types';
import { api } from '../../services/api';

interface MoodChangersViewProps {
  latestMood?: MoodType;
}

export const MoodChangersView: React.FC<MoodChangersViewProps> = ({ latestMood }) => {
  const [items, setItems] = useState<MoodChangerItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MoodChangerCategory | 'all'>('all');
  const [selectedTargetMood, setSelectedTargetMood] = useState<string>('all');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // AI Recommendation Engine state
  const [aiCurrentFeeling, setAiCurrentFeeling] = useState(latestMood ? `feeling ${latestMood}` : '');
  const [aiDesiredShift, setAiDesiredShift] = useState('gentle comfort and perspective shift');
  const [aiPreferredType, setAiPreferredType] = useState('all');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiResults, setAiResults] = useState<MoodChangerItem[]>([]);

  useEffect(() => {
    loadCuratedItems();
  }, []);

  const loadCuratedItems = async () => {
    try {
      const data = await api.getCuratedMoodChangers();
      setItems(data);
    } catch (err) {
      console.error('Failed to load mood changers:', err);
    }
  };

  const handleToggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleGenerateAi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAi(true);
    try {
      const res = await api.getAiRecommendations({
        currentMood: aiCurrentFeeling || latestMood || 'stressed and overthinking',
        desiredShift: aiDesiredShift || 'grounded and peaceful',
        preferredType: aiPreferredType === 'all' ? 'mixed movies, books, or activities' : aiPreferredType,
      });
      setAiResults(res);
    } catch (err) {
      console.error('Failed to generate AI recommendations:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Combine AI results and curated items
  const allItems = [...aiResults, ...items];

  const filteredItems = allItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesMood =
      selectedTargetMood === 'all' ||
      item.moodTarget.toLowerCase().includes(selectedTargetMood.toLowerCase());
    return matchesCategory && matchesMood;
  });

  const moodFilterChips = [
    { label: 'All Needs', value: 'all' },
    { label: 'Anxiety & Racing Mind', value: 'anxiety' },
    { label: 'Low Mood & Sadness', value: 'low' },
    { label: 'Overthinking Loops', value: 'overthinking' },
    { label: 'Tension & Panic', value: 'panic' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-violet-50 via-purple-50 to-stone-50 border border-violet-100 rounded-3xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-violet-800 bg-violet-100/80 px-2.5 py-1 rounded-full mb-3">
            <Film className="w-3.5 h-3.5 text-violet-600" />
            Mood Changers & Comfort Media
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif tracking-tight">
            Shift your emotional wavelength
          </h1>
          <p className="text-stone-600 text-sm mt-2 leading-relaxed">
            When your mind is stuck in dark or anxious loops, cognitive reasoning alone is often too slow. Immersing your senses in gentle comfort films, comforting books, or somatic sensory resets gives your nervous system permission to downshift.
          </p>
        </div>
      </div>

      {/* AI Personalized Recommendation Generator */}
      <div className="bg-white rounded-3xl border border-violet-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-violet-900 font-bold text-base font-serif">
          <Bot className="w-5 h-5 text-violet-600" />
          <span>Ask Gemini: Recommend what I need to watch, read, or do</span>
        </div>
        <p className="text-xs text-stone-500 leading-relaxed">
          Tell Gemini exactly what state you are in right now. It will select comforting movies, gentle books, or low-friction activities curated with specific psychological grounding benefits.
        </p>

        <form onSubmit={handleGenerateAi} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">How you feel right now:</label>
            <input
              type="text"
              value={aiCurrentFeeling}
              onChange={(e) => setAiCurrentFeeling(e.target.value)}
              placeholder="e.g. Heavy-hearted, restless, exhausted"
              className="w-full bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-stone-900 border border-stone-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl px-3.5 py-2 text-xs outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">What shift you need:</label>
            <input
              type="text"
              value={aiDesiredShift}
              onChange={(e) => setAiDesiredShift(e.target.value)}
              placeholder="e.g. Pure laughter, gentle crying, quiet calm"
              className="w-full bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-stone-900 border border-stone-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl px-3.5 py-2 text-xs outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Type preference:</label>
            <select
              value={aiPreferredType}
              onChange={(e) => setAiPreferredType(e.target.value)}
              className="w-full bg-stone-50 hover:bg-stone-100/60 focus:bg-white text-stone-900 border border-stone-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl px-3 py-2 text-xs outline-none transition-all"
            >
              <option value="all">Any (Mixed Movies, Books & Activities)</option>
              <option value="movie">Movies & Comfort Shows only</option>
              <option value="book">Books & Reads only</option>
              <option value="activity">Low-friction Activities only</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex justify-end pt-1">
            <button
              id="generate-recommendations-btn"
              type="submit"
              disabled={isGeneratingAi}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Gemini is finding comforting recommendations...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recommend Mood Changers with AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Category Tabs & Mood Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Main Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              id="filter-all"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              All Mood Changers ({allItems.length})
            </button>
            <button
              id="filter-movies"
              onClick={() => setSelectedCategory('movie')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'movie'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-violet-500" />
              <span>Movies & Shows</span>
            </button>
            <button
              id="filter-books"
              onClick={() => setSelectedCategory('book')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'book'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Books & Reads</span>
            </button>
            <button
              id="filter-activities"
              onClick={() => setSelectedCategory('activity')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'activity'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Stuff to Do (Activities)</span>
            </button>
          </div>

          {/* Target Mood Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {moodFilterChips.map((chip) => (
              <button
                key={chip.value}
                onClick={() => setSelectedTargetMood(chip.value)}
                className={`text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                  selectedTargetMood === chip.value
                    ? 'bg-violet-100 text-violet-900 font-bold'
                    : 'text-stone-500 hover:bg-stone-100'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mood Changer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isSaved = savedIds.includes(item.id);
            const isAiGenerated = item.id.startsWith('ai-');
            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-all relative ${
                  isAiGenerated ? 'border-violet-300 ring-1 ring-violet-200' : 'border-stone-200'
                }`}
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">
                        {item.category === 'movie' ? '🎬' : item.category === 'book' ? '📚' : '🏃'}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                        {item.category === 'movie' ? 'Movie' : item.category === 'book' ? 'Book' : 'Activity'}
                      </span>
                      {isAiGenerated && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
                          AI Pick
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleSave(item.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSaved
                          ? 'text-violet-600 bg-violet-50'
                          : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                      }`}
                      title={isSaved ? 'Saved to favorites' : 'Bookmark this item'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-violet-600' : ''}`} />
                    </button>
                  </div>

                  <h3 className="font-bold text-base text-stone-900 font-serif leading-snug">
                    {item.title}
                  </h3>
                  {item.creatorOrYear && (
                    <p className="text-xs text-stone-400 mt-0.5">{item.creatorOrYear}</p>
                  )}

                  <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer: Psychological Benefit & Tags */}
                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 text-[11px] text-stone-700 space-y-1">
                    <span className="font-bold text-emerald-800 block">💡 Why it shifts your mood:</span>
                    <p className="leading-relaxed">{item.whyItHelps}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span className="font-medium text-stone-500">🎯 {item.moodTarget}</span>
                    {item.durationOrLength && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.durationOrLength}</span>
                      </span>
                    )}
                  </div>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
