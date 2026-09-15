import React, { useState, useEffect } from 'react';
import {
  Smile,
  Meh,
  Frown,
  Flame,
  CloudRain,
  Zap,
  Tag,
  CheckCircle2,
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { MoodType, MoodOption, MoodLog } from '../../types';
import { api } from '../../services/api';

interface MoodCheckViewProps {
  onMoodLogged: (mood: MoodType) => void;
  onNavigateToChat: () => void;
  onNavigateToOverthinking: () => void;
}

const moodOptions: MoodOption[] = [
  {
    type: 'great',
    label: 'Radiant & Thriving',
    emoji: '☀️',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 hover:bg-amber-100/70 border-amber-200',
    borderColor: 'border-amber-400 ring-2 ring-amber-200',
    score: 5,
  },
  {
    type: 'good',
    label: 'Calm & Content',
    emoji: '🌿',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100/70 border-emerald-200',
    borderColor: 'border-emerald-500 ring-2 ring-emerald-200',
    score: 4,
  },
  {
    type: 'okay',
    label: 'Neutral & Steady',
    emoji: '☁️',
    color: 'text-stone-600',
    bgColor: 'bg-stone-50 hover:bg-stone-100/70 border-stone-200',
    borderColor: 'border-stone-400 ring-2 ring-stone-200',
    score: 3,
  },
  {
    type: 'anxious',
    label: 'Anxious & Restless',
    emoji: '🌪️',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100/70 border-orange-200',
    borderColor: 'border-orange-400 ring-2 ring-orange-200',
    score: 2,
  },
  {
    type: 'low',
    label: 'Low & Depleted',
    emoji: '🌧️',
    color: 'text-sky-700',
    bgColor: 'bg-sky-50 hover:bg-sky-100/70 border-sky-200',
    borderColor: 'border-sky-400 ring-2 ring-sky-200',
    score: 1,
  },
  {
    type: 'overwhelmed',
    label: 'Overwhelmed & In Crisis',
    emoji: '⚡',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 hover:bg-rose-100/70 border-rose-200',
    borderColor: 'border-rose-400 ring-2 ring-rose-200',
    score: 1,
  },
];

const availableTags = [
  'Work & Career',
  'Sleep Quality',
  'Relationships',
  'Loneliness',
  'Future Uncertainty',
  'Health & Body',
  'Studies & Exams',
  'Social Life',
  'Self-Worth',
  'Finances',
];

export const MoodCheckView: React.FC<MoodCheckViewProps> = ({
  onMoodLogged,
  onNavigateToChat,
  onNavigateToOverthinking,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>('okay');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Sleep Quality']);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSavedRecently, setHasSavedRecently] = useState(false);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    try {
      const logs = await api.getMoods();
      setMoodLogs(logs);
    } catch (err) {
      console.error('Failed to load mood history:', err);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const moodObj = moodOptions.find((m) => m.type === selectedMood);
    const score = moodObj ? moodObj.score : 3;

    try {
      await api.logMood({
        mood: selectedMood,
        score,
        emotionTags: selectedTags,
        note: note.trim(),
      });

      onMoodLogged(selectedMood);
      setHasSavedRecently(true);
      setNote('');
      await loadMoods();

      setTimeout(() => {
        setHasSavedRecently(false);
      }, 4000);
    } catch (err) {
      console.error('Failed to log mood:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageScore = moodLogs.length
    ? (moodLogs.reduce((acc, curr) => acc + curr.score, 0) / moodLogs.length).toFixed(1)
    : '3.0';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Introduction banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 border border-emerald-100 rounded-3xl p-6 sm:p-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Daily Emotional Check-in
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif tracking-tight">
            How does your mind feel right now?
          </h1>
          <p className="text-stone-600 text-sm mt-2 leading-relaxed">
            There is no right or wrong answer. Simply pausing to name and accept your current emotional weather softens the grip of stress and helps your nervous system settle.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Check-in */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Select Mood Grid */}
            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-3">
                1. Select your primary emotional state:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {moodOptions.map((option) => {
                  const isSelected = selectedMood === option.type;
                  return (
                    <button
                      key={option.type}
                      type="button"
                      id={`mood-select-${option.type}`}
                      onClick={() => setSelectedMood(option.type)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all text-center ${
                        isSelected ? `${option.bgColor} ${option.borderColor} shadow-xs` : option.bgColor
                      }`}
                    >
                      <span className="text-3xl mb-1.5 transform transition-transform group-hover:scale-110">
                        {option.emoji}
                      </span>
                      <span className="text-xs font-bold text-stone-900">{option.label}</span>
                      <span className="text-[10px] text-stone-500 mt-0.5">Level {option.score}/5</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Emotional Context Tags */}
            <div>
              <label className="block text-sm font-semibold text-stone-900 mb-2">
                2. What areas are influencing this feeling? (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isChecked = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isChecked
                          ? 'bg-stone-900 text-white shadow-2xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Reflection Note */}
            <div>
              <label htmlFor="mood-note-input" className="block text-sm font-semibold text-stone-900 mb-2">
                3. Gentle reflection or note (Optional):
              </label>
              <textarea
                id="mood-note-input"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What is going through your head? Any physical sensations in your chest, stomach, or shoulders?"
                className="w-full bg-stone-50 hover:bg-stone-100/50 focus:bg-white text-stone-900 border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-2xl p-4 text-sm transition-all outline-none resize-none"
              />
            </div>

            {/* Submit button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                id="save-mood-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving to Database...' : 'Save Today\'s Check-in'}</span>
              </button>

              {hasSavedRecently && (
                <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1.5 animate-fade-in border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Logged safely! Remember to be kind to yourself.</span>
                </div>
              )}
            </div>
          </form>

          {/* Quick Recommendations depending on logged mood */}
          {(selectedMood === 'anxious' || selectedMood === 'overwhelmed') && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-amber-900">Feeling tense or caught in racing thoughts?</h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Try our Overthinking SOS tools or chat with MindEase to unburden your mind.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onNavigateToOverthinking}
                  className="px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-colors shadow-2xs whitespace-nowrap"
                >
                  Overthinking Tools
                </button>
                <button
                  onClick={onNavigateToChat}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/60 rounded-xl transition-colors whitespace-nowrap"
                >
                  Chat with AI
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Mood History & Insights */}
        <div className="space-y-6">
          {/* Quick Stats Box */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Emotional Summary</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 text-center">
                <span className="text-2xl font-extrabold text-stone-900">{moodLogs.length}</span>
                <p className="text-[11px] text-stone-500 mt-0.5">Total Check-ins</p>
              </div>
              <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100 text-center">
                <span className="text-2xl font-extrabold text-emerald-700">{averageScore}</span>
                <span className="text-xs text-stone-400">/5</span>
                <p className="text-[11px] text-stone-500 mt-0.5">Average Balance</p>
              </div>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              Tracking your emotional states over time helps reveal hidden patterns, such as sleep deprivation triggering anxious spirals or social connection lifting your baseline.
            </p>
          </div>

          {/* Timeline of Recent Check-ins */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-stone-500" />
              <span>Recent Check-ins</span>
            </h3>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {moodLogs.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-4 text-center">No check-ins recorded yet.</p>
              ) : (
                moodLogs.slice(0, 5).map((log) => {
                  const mObj = moodOptions.find((m) => m.type === log.mood);
                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-semibold text-stone-900">
                          <span>{mObj?.emoji || '🌿'}</span>
                          <span className="capitalize">{log.mood}</span>
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(log.timestamp).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {log.note && <p className="text-stone-600 line-clamp-2 italic">"{log.note}"</p>}
                      {log.emotionTags && log.emotionTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {log.emotionTags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
