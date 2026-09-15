import React from 'react';
import {
  Heart,
  MessageSquareHeart,
  Smile,
  Sparkles,
  Compass,
  Film,
  PhoneCall,
  Database,
  Bot,
} from 'lucide-react';
import { AppServerStatus } from '../types';

export type TabType = 'chat' | 'mood' | 'practices' | 'overthinking' | 'changers';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenCrisis: () => void;
  serverStatus: AppServerStatus | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenCrisis,
  serverStatus,
}) => {
  const tabs = [
    {
      id: 'chat' as TabType,
      label: 'AI Assistant',
      description: 'Empathetic Companion',
      icon: MessageSquareHeart,
    },
    {
      id: 'mood' as TabType,
      label: 'Mood Check',
      description: 'Daily Check-in',
      icon: Smile,
    },
    {
      id: 'practices' as TabType,
      label: 'Daily Practices',
      description: 'Gratitude & Affirmations',
      icon: Sparkles,
    },
    {
      id: 'overthinking' as TabType,
      label: 'Overthinking SOS',
      description: 'Grounding & Deconstruction',
      icon: Compass,
    },
    {
      id: 'changers' as TabType,
      label: 'Mood Changers',
      description: 'Movies, Books & Activities',
      icon: Film,
    },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('chat')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-4 ring-emerald-50">
              <Heart className="w-6 h-6 fill-white/20 stroke-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-stone-900 tracking-tight font-serif">MindEase</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  AI Wellness
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">Full-Stack Mental Health Companion</p>
            </div>
          </div>

          {/* Center / Right Badges & Emergency SOS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* MongoDB Badge */}
            <div
              id="mongo-status-badge"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-stone-50 border-stone-200 text-stone-600"
              title={
                serverStatus?.mongodbConnected
                  ? `Connected to MongoDB: ${serverStatus.databaseName}`
                  : 'Operating via local safe persistent storage'
              }
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {serverStatus?.mongodbConnected ? 'MongoDB Connected' : 'MongoDB Safe Storage'}
              </span>
            </div>

            {/* AI Active Badge */}
            <div
              id="ai-status-badge"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50 border-emerald-200 text-emerald-700"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Gemini AI Active</span>
            </div>

            {/* Emergency Helpline button */}
            <button
              id="header-crisis-btn"
              onClick={onOpenCrisis}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors shadow-xs"
              title="Immediate crisis lifelines and free emergency support"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Crisis Lifelines</span>
              <span className="sm:hidden">Help</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-sm shadow-stone-900/20'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
