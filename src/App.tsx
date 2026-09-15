import React, { useState, useEffect } from 'react';
import { Header, TabType } from './components/Header';
import { AiChatView } from './components/views/AiChatView';
import { MoodCheckView } from './components/views/MoodCheckView';
import { DailyPracticesView } from './components/views/DailyPracticesView';
import { OverthinkingView } from './components/views/OverthinkingView';
import { MoodChangersView } from './components/views/MoodChangersView';
import { CrisisModal } from './components/CrisisModal';
import { AppServerStatus, MoodType } from './types';
import { api } from './services/api';
import { Heart, ShieldCheck, Sparkles, Database } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('chat');
  const [serverStatus, setServerStatus] = useState<AppServerStatus | null>(null);
  const [latestMood, setLatestMood] = useState<MoodType>('okay');
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const status = await api.getStatus();
      setServerStatus(status);
    } catch (err) {
      console.warn('Could not fetch server status:', err);
    }
  };

  const handleMoodLogged = (mood: MoodType) => {
    setLatestMood(mood);
    fetchStatus();
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 font-sans selection:bg-emerald-200">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
        serverStatus={serverStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'chat' && (
          <AiChatView
            latestMood={latestMood}
            onNavigateToOverthinking={() => setCurrentTab('overthinking')}
            onOpenCrisis={() => setIsCrisisModalOpen(true)}
          />
        )}

        {currentTab === 'mood' && (
          <MoodCheckView
            onMoodLogged={handleMoodLogged}
            onNavigateToChat={() => setCurrentTab('chat')}
            onNavigateToOverthinking={() => setCurrentTab('overthinking')}
          />
        )}

        {currentTab === 'practices' && (
          <DailyPracticesView latestMood={latestMood} />
        )}

        {currentTab === 'overthinking' && (
          <OverthinkingView />
        )}

        {currentTab === 'changers' && (
          <MoodChangersView latestMood={latestMood} />
        )}
      </main>

      {/* Calming, Non-Intrusive Footer */}
      <footer className="border-t border-stone-200 bg-white/70 backdrop-blur-sm mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-emerald-600 fill-emerald-100" />
            <span className="font-serif font-medium text-stone-700">MindEase</span>
            <span>—</span>
            <span>Full-Stack AI Mental Health Platform (React • Node.js • Express • MongoDB • Gemini AI)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCrisisModalOpen(true)}
              className="text-rose-600 hover:text-rose-800 font-semibold underline underline-offset-2 transition-colors"
            >
              Crisis Lifelines (988)
            </button>
            <span className="text-stone-300">•</span>
            <span className="text-[11px] text-stone-400">
              {serverStatus?.mongodbConnected
                ? `MongoDB: ${serverStatus.databaseName}`
                : 'Local Safe Persistent Storage Active'}
            </span>
          </div>
        </div>
      </footer>

      {/* Global Emergency Crisis Lifeline Modal */}
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />
    </div>
  );
}
