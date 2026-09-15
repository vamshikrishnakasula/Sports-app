import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  BookOpen,
  Plus,
  Trash2,
  Lightbulb,
  CheckCircle2,
  Bot,
  Loader2,
  Quote,
} from 'lucide-react';
import { PracticeEntry, PracticeType, MoodType } from '../../types';
import { api } from '../../services/api';

interface DailyPracticesViewProps {
  latestMood?: MoodType;
}

export const DailyPracticesView: React.FC<DailyPracticesViewProps> = ({ latestMood }) => {
  const [activeSubTab, setActiveSubTab] = useState<PracticeType>('gratitude');
  const [entries, setEntries] = useState<PracticeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // AI Affirmation generator states
  const [customFeeling, setCustomFeeling] = useState('');
  const [customChallenge, setCustomChallenge] = useState('');
  const [generatedAffirmations, setGeneratedAffirmations] = useState<string[]>([]);
  const [isGeneratingAffirmation, setIsGeneratingAffirmation] = useState(false);

  const gratitudePrompts = [
    'Three tiny sensory comforts I enjoyed today (e.g. warm sun, a soft blanket, tea)...',
    'A person whose presence or kindness made my day slightly easier...',
    'Something in my body that works hard for me without me even thinking about it...',
    'A mistake or tough situation that ended up teaching me a valuable lesson...',
  ];

  const journalPrompts = [
    'What is one heavy expectation I can grant myself permission to lay down today?',
    'What would I say to a dear friend who was experiencing the exact same worries I have right now?',
    'Where in my body am I holding physical tension, and what might that tension be trying to communicate?',
    'If I paused trying to fix everything for just the next hour, what would happen?',
  ];

  useEffect(() => {
    loadEntries();
  }, [activeSubTab]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPractices(activeSubTab);
      setEntries(data);
    } catch (err) {
      console.error('Failed to load practices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      await api.createPractice({
        type: activeSubTab,
        title: title.trim() || `${activeSubTab.charAt(0).toUpperCase() + activeSubTab.slice(1)} Reflection`,
        content: content.trim(),
        promptUsed: selectedPrompt || undefined,
        moodAssociated: latestMood,
      });

      setTitle('');
      setContent('');
      setSelectedPrompt('');
      await loadEntries();
    } catch (err) {
      console.error('Failed to save practice:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this practice entry?')) {
      try {
        await api.deletePractice(id);
        setEntries((prev) => prev.filter((e) => e.id !== id));
      } catch (err) {
        console.error('Delete practice error:', err);
      }
    }
  };

  const handleGenerateAffirmations = async () => {
    setIsGeneratingAffirmation(true);
    try {
      const res = await api.generateAffirmations(
        customFeeling || latestMood || 'anxiety and self-criticism',
        customChallenge || 'overthinking and fear of failure'
      );
      setGeneratedAffirmations(res.affirmations || []);
    } catch (err) {
      console.error('Failed to generate affirmations:', err);
    } finally {
      setIsGeneratingAffirmation(false);
    }
  };

  const handleSaveAffirmationAsEntry = async (aff: string) => {
    try {
      await api.createPractice({
        type: 'affirmation',
        title: 'Daily Grounded Affirmation',
        content: aff,
        moodAssociated: latestMood,
      });
      if (activeSubTab === 'affirmation') {
        await loadEntries();
      } else {
        setActiveSubTab('affirmation');
      }
    } catch (err) {
      console.error('Save affirmation error:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-stone-50 border border-teal-100 rounded-3xl p-6 sm:p-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100/80 px-2.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Daily Mental Health Practices
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif tracking-tight">
            Nurture your inner foundation
          </h1>
          <p className="text-stone-600 text-sm mt-2 leading-relaxed">
            Consistent micro-habits rewires neural pathways away from chronic panic towards emotional resilience. Spend 3 quiet minutes with gratitude, grounded affirmations, or introspective journaling.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          <button
            id="subtab-gratitude"
            onClick={() => setActiveSubTab('gratitude')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'gratitude'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Gratitude Log</span>
          </button>
          <button
            id="subtab-affirmation"
            onClick={() => setActiveSubTab('affirmation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'affirmation'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Affirmations (AI Powered)</span>
          </button>
          <button
            id="subtab-journal"
            onClick={() => setActiveSubTab('journal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'journal'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>Mindful Journaling</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form or Generator */}
        <div className="lg:col-span-2 space-y-6">
          {/* AFFIRMATION SPECIAL SECTION: AI GENERATOR */}
          {activeSubTab === 'affirmation' && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-3xl p-6 sm:p-7 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-base font-serif">
                <Bot className="w-5 h-5 text-amber-600" />
                <span>Generate Personalized Grounded Affirmations (AI)</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Standard affirmations sometimes feel fake or hollow. Tell Gemini what you are genuinely struggling with, and it will generate honest, non-toxic affirmations tailored to your situation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">How you feel:</label>
                  <input
                    type="text"
                    value={customFeeling}
                    onChange={(e) => setCustomFeeling(e.target.value)}
                    placeholder="e.g. Impostor syndrome, exhausted, guilty for resting"
                    className="w-full bg-white border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">The current challenge:</label>
                  <input
                    type="text"
                    value={customChallenge}
                    onChange={(e) => setCustomChallenge(e.target.value)}
                    placeholder="e.g. Big presentation, breakup, life uncertainty"
                    className="w-full bg-white border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 rounded-xl px-3.5 py-2 text-xs text-stone-900 outline-none"
                  />
                </div>
              </div>

              <button
                id="generate-affirmations-btn"
                type="button"
                onClick={handleGenerateAffirmations}
                disabled={isGeneratingAffirmation}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-2xs"
              >
                {isGeneratingAffirmation ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini is generating affirmations...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Affirmations with AI</span>
                  </>
                )}
              </button>

              {/* Generated AI List */}
              {generatedAffirmations.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-amber-200/80">
                  <span className="text-xs font-bold text-amber-900">Choose an affirmation to save:</span>
                  {generatedAffirmations.map((aff, i) => (
                    <div
                      key={i}
                      className="bg-white border border-amber-200 p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs text-stone-800 shadow-2xs"
                    >
                      <p className="italic font-medium">"{aff}"</p>
                      <button
                        onClick={() => handleSaveAffirmationAsEntry(aff)}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-[11px] transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Practice Creation Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              <span>
                Add {activeSubTab === 'gratitude' ? 'Gratitude Entry' : activeSubTab === 'affirmation' ? 'Custom Affirmation' : 'Journal Entry'}
              </span>
            </h2>

            {/* Prompt Selector */}
            {(activeSubTab === 'gratitude' || activeSubTab === 'journal') && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Choose an inspiring prompt (Optional):</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(activeSubTab === 'gratitude' ? gratitudePrompts : journalPrompts).map(
                    (prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedPrompt(prompt);
                          if (!title) {
                            setTitle(prompt.slice(0, 35) + '...');
                          }
                        }}
                        className={`text-left text-xs p-3 rounded-2xl border transition-all ${
                          selectedPrompt === prompt
                            ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-medium'
                            : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                        }`}
                      >
                        {prompt}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Main Editor Form */}
            <form onSubmit={handleSaveEntry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    activeSubTab === 'gratitude'
                      ? 'e.g. Three quiet moments today'
                      : activeSubTab === 'affirmation'
                      ? 'e.g. Embracing uncertainty'
                      : 'e.g. Evening brain dump'
                  }
                  className="w-full bg-stone-50 hover:bg-stone-100/50 focus:bg-white text-stone-900 border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-2xl px-4 py-2.5 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {activeSubTab === 'gratitude'
                    ? 'What are you grateful for?'
                    : activeSubTab === 'affirmation'
                    ? 'Affirmation statement:'
                    : 'Your journal reflection:'}
                </label>
                <textarea
                  rows={activeSubTab === 'journal' ? 6 : 4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    activeSubTab === 'gratitude'
                      ? '1. The morning sun coming through the window\n2. Savoring my first sip of water\n3. Giving myself credit for showing up'
                      : activeSubTab === 'affirmation'
                      ? 'I am safe in this present moment, even when my brain feels noisy.'
                      : 'Let your thoughts flow freely without editing or judging your grammar...'
                  }
                  required
                  className="w-full bg-stone-50 hover:bg-stone-100/50 focus:bg-white text-stone-900 border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-2xl p-4 text-sm outline-none transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  id="save-practice-btn"
                  type="submit"
                  disabled={isSaving || !content.trim()}
                  className="px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-semibold text-sm transition-colors flex items-center gap-2 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isSaving ? 'Saving to Database...' : 'Save Practice Entry'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Saved History of Entries */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-stone-900 capitalize font-serif">
                Saved {activeSubTab}s ({entries.length})
              </h3>
              <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                MongoDB Synced
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-stone-400 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span className="text-xs">Loading entries...</span>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-10 px-4 text-stone-400 text-xs italic space-y-2">
                <Quote className="w-6 h-6 mx-auto text-stone-300" />
                <p>No {activeSubTab} entries recorded yet. Take a moment to log your first reflection!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-stone-200 transition-colors space-y-2 group relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-xs text-stone-900">{entry.title}</h4>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-stone-300 hover:text-rose-600 p-1 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {entry.promptUsed && (
                      <p className="text-[11px] text-emerald-700 bg-emerald-50/70 px-2 py-1 rounded-lg">
                        Prompt: {entry.promptUsed}
                      </p>
                    )}

                    <p className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed">
                      {entry.content}
                    </p>

                    <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-200/50 flex items-center justify-between">
                      <span>
                        {new Date(entry.timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      {entry.moodAssociated && (
                        <span className="capitalize text-stone-500">Mood: {entry.moodAssociated}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
