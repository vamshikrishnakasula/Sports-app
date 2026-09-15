import {
  MoodLog,
  PracticeEntry,
  ChatMessage,
  OverthinkingAnalysis,
  MoodChangerItem,
  AppServerStatus,
  PracticeType,
} from '../types';

export const api = {
  // Server and MongoDB status
  async getStatus(): Promise<AppServerStatus> {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Failed to fetch status');
    return res.json();
  },

  // Mood Logs
  async getMoods(): Promise<MoodLog[]> {
    const res = await fetch('/api/moods');
    if (!res.ok) throw new Error('Failed to fetch mood logs');
    return res.json();
  },

  async logMood(data: Omit<MoodLog, 'id' | 'timestamp'>): Promise<MoodLog> {
    const res = await fetch('/api/moods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save mood log');
    return res.json();
  },

  // Daily Practices (Gratitude, Affirmation, Journaling)
  async getPractices(type?: PracticeType): Promise<PracticeEntry[]> {
    const url = type ? `/api/practices?type=${type}` : '/api/practices';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch practices');
    return res.json();
  },

  async createPractice(data: {
    type: PracticeType;
    title?: string;
    content: string;
    promptUsed?: string;
    moodAssociated?: string;
  }): Promise<PracticeEntry> {
    const res = await fetch('/api/practices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save practice entry');
    return res.json();
  },

  async deletePractice(id: string): Promise<{ success: boolean; id: string }> {
    const res = await fetch(`/api/practices/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete practice entry');
    return res.json();
  },

  // AI Chat Assistant
  async getChatHistory(): Promise<ChatMessage[]> {
    const res = await fetch('/api/chat');
    if (!res.ok) throw new Error('Failed to load chat history');
    return res.json();
  },

  async sendMessage(message: string, currentMood?: string): Promise<ChatMessage> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, currentMood }),
    });
    if (!res.ok) throw new Error('Failed to send message to AI companion');
    return res.json();
  },

  async resetChat(): Promise<void> {
    const res = await fetch('/api/chat', {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to clear chat');
  },

  // Overthinking Relief AI
  async analyzeOverthinking(thought: string, context?: string): Promise<OverthinkingAnalysis> {
    const res = await fetch('/api/ai/overthinking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thought, context }),
    });
    if (!res.ok) throw new Error('Failed to analyze overthinking');
    return res.json();
  },

  // Personalized Affirmations
  async generateAffirmations(feeling?: string, challenge?: string): Promise<{ affirmations: string[] }> {
    const res = await fetch('/api/ai/affirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feeling, challenge }),
    });
    if (!res.ok) throw new Error('Failed to generate affirmations');
    return res.json();
  },

  // Mood Changers (Curated & AI recommendations)
  async getCuratedMoodChangers(): Promise<MoodChangerItem[]> {
    const res = await fetch('/api/mood-changers');
    if (!res.ok) throw new Error('Failed to fetch mood changers');
    return res.json();
  },

  async getAiRecommendations(params: {
    currentMood?: string;
    desiredShift?: string;
    preferredType?: string;
  }): Promise<MoodChangerItem[]> {
    const res = await fetch('/api/ai/recommend-changers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate recommendations');
    return res.json();
  },
};
